import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CreditCard, Smartphone, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatRWF } from "@/data/products";
import { makeOrderId, saveOrder, type PaymentMethod } from "@/lib/orders";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Net Phantom Store Rwanda" }] }),
  component: CheckoutPage,
});

const DELIVERY = 3_000;

function CheckoutPage() {
  const { detailed, subtotal, discount, discountCode, clear } = useCart();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("mtn_momo");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const total = Math.max(0, subtotal - discount + (detailed.length ? DELIVERY : 0));

  if (done) {
    return <div className="mx-auto max-w-xl px-4 py-20 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" /><h1 className="mt-5 font-display text-3xl font-black">Order received!</h1><p className="mt-2 text-sm text-muted-foreground">Your order is saved. Payment is currently marked pending until the payment provider confirms it.</p><Link to="/" className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground">Continue shopping</Link></div>;
  }

  if (!detailed.length) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="font-display text-3xl font-black">Your cart is empty</h1><Link to="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-bold text-primary-foreground">Shop now</Link></div>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const order = {
      id: makeOrderId(), createdAt: new Date().toISOString(), customer: form,
      items: detailed.map(({ product, qty }) => ({ productId: product.id, name: product.name, qty, price: product.price })),
      subtotal, delivery: DELIVERY, discount, total, paymentMethod: method,
      paymentStatus: "pending" as const, status: "pending" as const,
    };
    saveOrder(order);
    clear();
    setDone(true);
    toast.success("Order placed successfully");
    void navigate({ to: "/" });
  }

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to cart</Link><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]"><form onSubmit={submit} className="space-y-6"><div className="card-glow rounded-xl p-6"><h1 className="font-display text-2xl font-black">Checkout</h1><div className="mt-5 grid gap-4 sm:grid-cols-2">{(["name","phone","email","address"] as const).map((key) => <label key={key} className="text-sm font-semibold sm:col-span-1"><span className="mb-2 block">{key === "name" ? "Full name" : key === "phone" ? "Phone number" : key === "email" ? "Email (optional)" : "Delivery address"}</span><input required={key !== "email"} type={key === "email" ? "email" : "text"} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={key === "phone" ? "+250 7xx xxx xxx" : key === "address" ? "Street, sector, district" : ""} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" /></label>)}</div></div><div className="card-glow rounded-xl p-6"><h2 className="font-display text-lg font-bold">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{([ ["mtn_momo","MTN MoMo",Smartphone], ["airtel_money","Airtel Money",Smartphone], ["card","Visa / Mastercard",CreditCard], ["cash_on_delivery","Cash on delivery",Truck] ] as const).map(([value,label,Icon]) => <button type="button" key={value} onClick={() => setMethod(value)} className={`flex items-center gap-3 rounded-lg border p-4 text-left ${method === value ? "border-primary bg-primary/10" : "border-border"}`}><Icon className="h-5 w-5 text-primary" /><span className="text-sm font-bold">{label}</span></button>)}</div><p className="mt-4 text-xs text-muted-foreground">Mobile-money and card credentials are intentionally handled server-side. This build records the order as pending until a live payment provider is configured.</p></div><button className="inline-flex h-12 w-full items-center justify-center rounded-md bg-gradient-brand text-sm font-bold uppercase tracking-wider text-primary-foreground glow-blue">Place order · {formatRWF(total)}</button></form><aside className="card-glow h-fit rounded-xl p-6"><h2 className="font-display text-lg font-bold">Order summary</h2><div className="mt-4 space-y-3">{detailed.map(({product,qty}) => <div key={product.id} className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{product.name} × {qty}</span><span className="font-semibold">{formatRWF(product.price * qty)}</span></div>)}<div className="border-t border-border pt-3"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatRWF(subtotal)}</span></div>{discount > 0 && <div className="mt-2 flex justify-between text-sm text-emerald-400"><span>Discount ({discountCode})</span><span>− {formatRWF(discount)}</span></div>}<div className="mt-2 flex justify-between text-sm"><span>Delivery</span><span>{formatRWF(DELIVERY)}</span></div><div className="mt-3 border-t border-border pt-3 flex justify-between"><span className="font-bold">Total</span><span className="font-display text-xl font-black text-gradient">{formatRWF(total)}</span></div></div></div></aside></div></div>;
}
