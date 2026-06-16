import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Truck, ShieldCheck, Star, Check } from "lucide-react";
import { formatRWF, getByCategory, getProduct } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/site/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    return {
      meta: [
        { title: `${p?.name ?? "Product"} — Net Phantom Store Rwanda` },
        { name: "description", content: p?.description ?? "Gaming product." },
        { property: "og:title", content: p?.name ?? "Product" },
        { property: "og:description", content: p?.description ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const related = getByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="px-1">/</span>
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-primary">
          {product.category.replace("-", " ")}
        </Link>
        <span className="px-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="card-glow overflow-hidden rounded-2xl">
            <img src={product.images[activeImg]} alt={product.name} width={800} height={800} className="aspect-square w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-md border ${i === activeImg ? "border-primary" : "border-border"}`}
                >
                  <img src={src} alt="" loading="lazy" width={80} height={80} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">{product.brand}</div>
            <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" /> {product.rating}
              </span>
              <span>·</span>
              <span>{product.reviews} reviews</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="font-display text-3xl font-black text-gradient">{formatRWF(product.price)}</div>
            {product.oldPrice && (
              <div className="pb-1 text-sm text-muted-foreground line-through">{formatRWF(product.oldPrice)}</div>
            )}
          </div>

          <div className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
            <Check className="h-3 w-3" />
            {product.stock > 0 ? `In stock · ${product.stock} units` : "Out of stock"}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center hover:bg-muted">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-11 w-11 place-items-center hover:bg-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => { add(product.id, qty); toast.success(`${qty} × ${product.name} added`); }}
              disabled={product.stock === 0}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground glow-blue disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </button>
          </div>

          <div className="grid gap-2 pt-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4 text-primary" /> Same-day Kigali delivery</div>
            <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> 2-year local warranty</div>
          </div>

          <div className="card-glow rounded-xl p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Specifications</h3>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-3 border-b border-border/50 py-1.5">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-black">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
