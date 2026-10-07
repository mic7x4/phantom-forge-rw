import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  LogOut,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { formatRWF } from "@/data/products";
import { getAdminDashboard, logoutAdmin } from "@/server/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Net Phantom Store" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  loader: async () => {
    try {
      return await getAdminDashboard();
    } catch {
      throw redirect({ to: "/admin-login" });
    }
  },
  component: AdminPage,
});

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function AdminPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const logout = useServerFn(logoutAdmin);

  async function handleLogout() {
    await logout();
    await router.navigate({ to: "/admin-login" });
  }

  if (!data.configured || !data.stats) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Control center</div>
            <h1 className="mt-2 font-display text-3xl font-black">Store Dashboard</h1>
          </div>
          <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>

        <section className="card-glow mt-8 rounded-2xl p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-black">Database setup required</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {data.error ?? "The dashboard cannot load store data yet."}
          </p>
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm">
            bun run db:migrate
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Make sure your server has a valid DATABASE_URL before running the migration.
          </p>
        </section>
      </main>
    );
  }

  const stats = [
    { label: "Paid revenue", value: formatRWF(data.stats.revenueRwf), icon: DollarSign },
    { label: "Orders", value: String(data.stats.orders), icon: ClipboardList },
    { label: "Customers", value: String(data.stats.customers), icon: Users },
    { label: "Pending work", value: String(data.stats.pendingOrders), icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Control center</div>
            <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Store Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Live data from your PostgreSQL commerce database.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">View store</Link>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {[
            ["Overview", "#overview"],
            ["Orders", "#orders"],
            ["Inventory", "#inventory"],
            ["Reports", "#reports"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
              {label}
            </a>
          ))}
        </nav>

        <section id="overview" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-glow rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 font-display text-2xl font-black">{value}</div>
            </div>
          ))}
        </section>

        <section id="reports" className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card-glow rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Store health</h2>
                <p className="mt-1 text-sm text-muted-foreground">Current catalog and fulfillment snapshot.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <HealthCard label="Products" value={data.stats.products} detail={`${data.stats.activeProducts} active`} icon={Package} />
              <HealthCard label="Low stock" value={data.lowStock.length} detail="Needs attention" icon={AlertTriangle} />
              <HealthCard label="Order pipeline" value={data.stats.pendingOrders} detail="Open orders" icon={Boxes} />
            </div>
          </div>

          <div className="card-glow rounded-xl p-6">
            <h2 className="font-display text-lg font-bold">Order status</h2>
            <div className="mt-5 space-y-3">
              {data.statusCounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                data.statusCounts.map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <span>{statusLabels[item.status] ?? item.status}</span>
                    <span className="rounded-full bg-muted px-2.5 py-1 font-bold">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="orders" className="card-glow mt-6 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Recent orders</h2>
              <p className="mt-1 text-sm text-muted-foreground">The latest 10 orders in the store.</p>
            </div>
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No orders have been created yet.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4">Order</th>
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">District</th>
                    <th className="py-3 pr-4">Total</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.orderNumber} className="border-b border-border/50 last:border-0">
                      <td className="py-4 pr-4 font-semibold">{order.orderNumber}</td>
                      <td className="py-4 pr-4">{order.customerName}</td>
                      <td className="py-4 pr-4">{order.district}</td>
                      <td className="py-4 pr-4 font-semibold">{formatRWF(order.totalRwf)}</td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold">
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="inventory" className="card-glow mt-6 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Low-stock products</h2>
              <p className="mt-1 text-sm text-muted-foreground">Products at or below their configured stock threshold.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>

          {data.lowStock.length === 0 ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" /> No low-stock products right now.
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.lowStock.map((item) => (
                <div key={item.productId} className="rounded-xl border border-border p-4">
                  <div className="truncate font-semibold">{item.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">SKU {item.sku}</div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Stock</div>
                      <div className="font-display text-xl font-black">{item.quantity}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">Alert at {item.threshold}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
          <span>Net Phantom Store admin</span>
          <span>Protected server-side</span>
        </footer>
      </div>
    </div>
  );
}

function HealthCard({ label, value, detail, icon: Icon }: { label: string; value: number; detail: string; icon: typeof Package }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
    </div>
  );
}
