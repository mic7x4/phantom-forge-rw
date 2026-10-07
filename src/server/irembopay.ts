import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import IremboPay from "@irembo/irembopay-node-sdk";
import { z } from "zod";
import { getDb } from "@/db/client";
import { orderItems, orders, paymentEvents, payments } from "@/db/schema";

const checkoutSchema = z.object({
  orderNumber: z.string().min(6).max(80),
  customer: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().min(9).max(30),
    email: z.string().email().max(255).optional().or(z.literal("")),
    address: z.string().min(3).max(500),
  }),
  items: z.array(z.object({
    productId: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    qty: z.number().int().positive().max(100),
    price: z.number().int().nonnegative(),
  })).min(1),
  subtotal: z.number().int().nonnegative(),
  delivery: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  paymentMethod: z.enum(["mtn_momo", "airtel_money", "card"]),
});

function getIremboPay() {
  const secretKey = process.env.IREMBOPAY_SECRET_KEY;
  const environment = process.env.IREMBOPAY_ENVIRONMENT ?? "sandbox";

  if (!secretKey) throw new Error("IremboPay is not configured: missing IREMBOPAY_SECRET_KEY.");
  if (!["sandbox", "checkout", "production"].includes(environment)) {
    throw new Error("Invalid IREMBOPAY_ENVIRONMENT.");
  }

  return new IremboPay(secretKey, environment);
}

export const createIremboInvoice = createServerFn({ method: "POST" })
  .validator((input) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    const publicKey = process.env.IREMBOPAY_PUBLIC_KEY;
    const paymentAccountIdentifier = process.env.IREMBOPAY_PAYMENT_ACCOUNT_IDENTIFIER;

    if (!publicKey || !paymentAccountIdentifier) {
      throw new Error("IremboPay is not configured: missing public key or payment account identifier.");
    }

    const db = getDb();
    const order = await db.transaction(async (tx) => {
      const [createdOrder] = await tx.insert(orders).values({
        orderNumber: data.orderNumber,
        customerName: data.customer.name,
        customerPhone: data.customer.phone,
        customerEmail: data.customer.email || null,
        deliveryDistrict: "Kigali",
        deliveryAddress: data.customer.address,
        subtotalRwf: data.subtotal,
        deliveryRwf: data.delivery,
        discountRwf: data.discount,
        totalRwf: data.total,
        status: "pending",
      }).returning({ id: orders.id, orderNumber: orders.orderNumber });

      await tx.insert(orderItems).values(data.items.map((item) => ({
        orderId: createdOrder.id,
        productId: null,
        productName: item.name,
        sku: item.productId,
        quantity: item.qty,
        unitPriceRwf: item.price,
        lineTotalRwf: item.price * item.qty,
      })));

      await tx.insert(payments).values({
        orderId: createdOrder.id,
        method: data.paymentMethod,
        amountRwf: data.total,
        status: "pending",
      });

      return createdOrder;
    });

    try {
      const iPay = getIremboPay();
      const invoice = await iPay.invoice.createInvoice({
        transactionId: order.orderNumber,
        paymentAccountIdentifier,
        customer: {
          name: data.customer.name,
          phoneNumber: data.customer.phone,
          ...(data.customer.email ? { email: data.customer.email } : {}),
        },
        paymentItems: data.items.map((item) => ({
          unitAmount: item.price,
          quantity: item.qty,
          code: item.productId,
        })),
        description: `Net Phantom Store order ${order.orderNumber}`,
        expiryAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        language: "EN",
      });

      const invoiceData = invoice as unknown as { invoiceNumber?: string; data?: { invoiceNumber?: string } };
      const invoiceNumber = invoiceData.invoiceNumber ?? invoiceData.data?.invoiceNumber;
      if (!invoiceNumber) throw new Error("IremboPay did not return an invoice number.");

      await db.update(payments)
        .set({ providerReference: String(invoiceNumber), updatedAt: new Date() })
        .where(eq(payments.orderId, order.id));

      return {
        ok: true,
        orderNumber: order.orderNumber,
        invoiceNumber: String(invoiceNumber),
        publicKey,
      };
    } catch (error) {
      await db.update(payments)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(payments.orderId, order.id));
      throw new Error(error instanceof Error ? error.message : "Unable to create IremboPay invoice.");
    }
  });

export async function handleIremboPayWebhook(rawBody: string, signature: string) {
  if (!signature) throw new Error("Missing IremboPay signature.");

  const iPay = getIremboPay();
  const valid = await iPay.util.verifySignature(rawBody, signature);
  if (!valid) throw new Error("Invalid IremboPay signature.");

  const payload = JSON.parse(rawBody) as {
    invoiceNumber?: string;
    transactionId?: string;
    paymentStatus?: string;
    paymentReference?: string;
    amount?: number;
    paymentMethod?: string;
    paidAt?: string;
  };

  if (!payload.invoiceNumber) throw new Error("Missing invoice number in IremboPay notification.");

  const db = getDb();
  const [payment] = await db
    .select({ id: payments.id, orderId: payments.orderId })
    .from(payments)
    .where(eq(payments.providerReference, payload.invoiceNumber))
    .limit(1);

  if (!payment) throw new Error("Payment record not found for IremboPay invoice.");

  const isPaid = String(payload.paymentStatus ?? "").toUpperCase() === "PAID";
  const nextStatus = isPaid ? "paid" : "failed";

  await db.transaction(async (tx) => {
    await tx.update(payments)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(eq(payments.id, payment.id));

    if (isPaid) {
      await tx.update(orders)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(orders.id, payment.orderId));
    }

    await tx.insert(paymentEvents).values({
      paymentId: payment.id,
      provider: "irembopay",
      eventType: isPaid ? "payment.paid" : "payment.failed",
      providerEventId: payload.paymentReference ?? payload.invoiceNumber,
      payload: rawBody,
    });
  });

  return { ok: true };
}
