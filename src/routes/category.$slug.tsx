import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { categories, getByCategory, getCategory } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const c = getCategory(params.slug);
    return {
      meta: [
        { title: `${c?.name ?? "Category"} — Net Phantom Store Rwanda` },
        { name: "description", content: c?.blurb ?? "Gaming gear in Rwanda." },
      ],
    };
  },
  loader: ({ params }) => {
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return { category: c };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = getByCategory(category.slug);
  const brands = Array.from(new Set(items.map((p) => p.brand)));

  const [brand, setBrand] = useState<string | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(Math.max(...items.map((p) => p.price)));
  const [inStock, setInStock] = useState(false);

  const filtered = items.filter(
    (p) => (brand === "all" || p.brand === brand) && p.price <= maxPrice && (!inStock || p.stock > 0),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="px-1">/</span>{" "}
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="card-glow relative mb-8 overflow-hidden rounded-2xl">
        <img src={category.image} alt="" loading="lazy" width={1600} height={400} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative p-8 sm:p-12">
          <h1 className="font-display text-3xl font-black sm:text-4xl text-gradient">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{category.blurb}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="card-glow h-fit space-y-6 rounded-xl p-5">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Categories</h3>
            <ul className="space-y-1 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/category/$slug" params={{ slug: c.slug }}
                    className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    activeProps={{ className: "bg-muted text-primary" }}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {brands.length > 1 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Brand</h3>
              <div className="space-y-1 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={brand === "all"} onChange={() => setBrand("all")} /> All brands
                </label>
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2">
                    <input type="radio" checked={brand === b} onChange={() => setBrand(b)} /> {b}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Max price</h3>
            <input
              type="range"
              min={Math.min(...items.map((p) => p.price))}
              max={Math.max(...items.map((p) => p.price))}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 text-xs text-muted-foreground">Up to {new Intl.NumberFormat().format(maxPrice)} RWF</div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            In stock only
          </label>
        </aside>

        <div>
          <div className="mb-4 text-sm text-muted-foreground">{filtered.length} products</div>
          {filtered.length === 0 ? (
            <div className="card-glow rounded-xl p-10 text-center text-sm text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
