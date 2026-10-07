import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { desc, eq, inArray, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { inventory, orders, payments, products, users } from "@/db/schema";
import { useAdminSession } from "./session";

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
});

type LoginAttempt = { count: number; resetAt: number };
const loginAttempts = new Map<string, LoginAttempt>();

function isRateLimited(key: string) {
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || now >= current.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

async function requireAdmin() {
  const session = await useAdminSession();
  if (session.data.role !== "admin" || !session.data.email) {
    throw new Error("Unauthorized");
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configuredEmail || session.data.email !== configuredEmail) {
    await session.clear();
    throw new Error("Unauthorized");
  }

  return { email: session.data.email };
}

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const key = data.email.toLowerCase();
    if (isRateLimited(key)) {
      return { ok: false, error: "Too many login attempts. Try again in 15 minutes." };
    }

    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (!configuredEmail || !configuredPassword || !process.env.SESSION_SECRET) {
      return { ok: false, error: "Admin authentication is not configured on the server." };
    }

    if (data.email.toLowerCase() !== configuredEmail || data.password !== configuredPassword) {
      return { ok: false, error: "Invalid email or password." };
    }

    const session = await useAdminSession();
    await session.update({ email: configuredEmail, role: "admin" });
    setResponseHeader("Cache-Control", "no-store");

    return { ok: true };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAdminSession();
  await session.clear();
  setResponseHeader("Cache-Control", "no-store");
  return { ok: true };
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  setResponseHeader("Cache-Control", "private, no-store");

  try {
    const db = getDb();

    const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    const [customerCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, "customer"));
    const [productCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
    const [activeProductCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.active, true));
    const [paidRevenue] = await db
      .select({ total: sql<number>`coalesce(sum(${payments.amountRwf}), 0)::int` })
      .from(payments)
      .where(eq(payments.status, "paid"));
    const [pendingOrderCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(inArray(orders.status, ["pending", "confirmed", "processing"]));

    const recentOrders = await db
      .select({
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        totalRwf: orders.totalRwf,
        status: orders.status,
        district: orders.deliveryDistrict,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    const lowStock = await db
      .select({
        productId: products.id,
        name: products.name,
        sku: products.sku,
        quantity: inventory.quantity,
        threshold: inventory.lowStockThreshold,
      })
      .from(inventory)
      .innerJoin(products, eq(products.id, inventory.productId))
      .where(sql`${inventory.quantity} <= ${inventory.lowStockThreshold}`)
      .orderBy(inventory.quantity)
      .limit(8);

    const statusRows = await db
      .select({ status: orders.status, count: sql<number>`count(*)::int` })
      .from(orders)
      .groupBy(orders.status);

    return {
      configured: true,
      stats: {
        orders: Number(orderCount?.count ?? 0),
        customers: Number(customerCount?.count ?? 0),
        products: Number(productCount?.count ?? 0),
        activeProducts: Number(activeProductCount?.count ?? 0),
        revenueRwf: Number(paidRevenue?.total ?? 0),
        pendingOrders: Number(pendingOrderCount?.count ?? 0),
      },
      recentOrders: recentOrders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      lowStock,
      statusCounts: statusRows.map((row) => ({ status: row.status, count: Number(row.count) })),
    };
  } catch (error) {
    console.error("Admin dashboard database error", error);
    return {
      configured: false,
      stats: null,
      recentOrders: [],
      lowStock: [],
      statusCounts: [],
      error: "The store database is not ready yet. Configure DATABASE_URL and run the Drizzle migration.",
    };
  }
});
