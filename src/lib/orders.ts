export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "mtn_momo" | "airtel_money" | "card" | "cash_on_delivery";

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string; address: string };
  items: { productId: string; name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";
  status: OrderStatus;
  paymentReference?: string;
};

const KEY = "phantom-forge-orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  localStorage.setItem(KEY, JSON.stringify([order, ...orders]));
}

export function updateOrder(id: string, patch: Partial<Order>) {
  const orders = getOrders().map((order) => order.id === id ? { ...order, ...patch } : order);
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function makeOrderId() {
  return `PF-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
