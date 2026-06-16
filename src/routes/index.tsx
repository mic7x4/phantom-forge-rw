import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Truck, ShieldCheck, Headphones, Star, Quote } from "lucide-react";
import heroImg from "@/assets/hero-setup.jpg";
import { categories, bestSellers, newArrivals, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Net Phantom Store Rwanda — Gaming PCs, Consoles & Gear in Kigali" },
      { name: "description", content: "Shop premium gaming PCs, laptops, consoles and accessories in Rwanda. Same-day delivery in Kigali. Pay with MTN MoMo, Airtel Money or card." },
    ],
  }),
  component: Home,
});

function Home() {
  const promo = products.find((p) => p.badge === "-15%") ?? products[2];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32 lg:px-8">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Zap className="h-3 w-3" /> Rwanda's #1 Gaming Store
            </span>
            <h1 className="font-display text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="text-gradient">UNLEASH</span>
              <br />
              YOUR PHANTOM
              <br />
              <span className="text-muted-foreground/80">LOADOUT.</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Custom gaming rigs, consoles and esports accessories — built and delivered
              from Kigali. Pay with MTN MoMo, Airtel Money or card.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/category/$slug"
                params={{ slug: "gaming-pcs" }}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground glow-blue transition hover:opacity-90"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#categories"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-background/60 px-6 text-sm font-bold uppercase tracking-wider backdrop-blur hover:border-primary/60"
              >
                Explore Products
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs">
              <div><div className="font-display text-2xl font-bold text-primary">500+</div><div className="text-muted-foreground">Products</div></div>
              <div><div className="font-display text-2xl font-bold text-primary">24h</div><div className="text-muted-foreground">Kigali delivery</div></div>
              <div><div className="font-display text-2xl font-bold text-primary">2yr</div><div className="text-muted-foreground">Local warranty</div></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -left-10 top-10 -z-10 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
            <div className="absolute -right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { Icon: Truck, t: "Same-day Kigali delivery", s: "Nationwide shipping across Rwanda" },
            { Icon: ShieldCheck, t: "2-year local warranty", s: "Authentic, sealed products" },
            { Icon: Zap, t: "MTN & Airtel Money", s: "Plus Visa & Mastercard" },
            { Icon: Headphones, t: "Gamer-first support", s: "Real humans, real fast" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-brand text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Browse" title="Shop by Category" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="card-glow card-glow-hover group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={c.image} alt={c.name} loading="lazy" width={400} height={500} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4">
                <div className="font-display text-base font-bold">{c.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Top performers" title="Best Sellers" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card-glow relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-card to-primary/20 p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/40 blur-3xl" />
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <span className="inline-block rounded-full border border-secondary/50 bg-secondary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
                Limited offer
              </span>
              <h3 className="font-display text-3xl font-black sm:text-4xl">
                Save 15% on the<br />
                <span className="text-gradient">{promo.name}</span>
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Upgrade your battlestation with a curved ultrawide built for esports. Use code <span className="font-bold text-primary">PHANTOM10</span> at checkout.
              </p>
              <Link
                to="/product/$slug"
                params={{ slug: promo.slug }}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Claim deal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <img src={promo.image} alt={promo.name} loading="lazy" width={800} height={800} className="mx-auto max-h-72 w-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* LATEST ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Fresh drops" title="Latest Arrivals" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="From the community" title="What gamers say" />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            { n: "Eric M.", c: "Kigali", t: "My Phantom Rig was delivered the same day. Setup was perfect — it's a beast on Apex Legends." },
            { n: "Aline U.", c: "Musanze", t: "Paid with MTN MoMo, no stress. The mouse and headset are stunning quality." },
            { n: "JP Habimana", c: "Rubavu", t: "Best gaming store in Rwanda. The team actually knows what they're talking about." },
          ].map((r) => (
            <div key={r.n} className="card-glow rounded-xl p-6">
              <Quote className="h-6 w-6 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">"{r.t}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}, Rwanda</div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="card-glow rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="font-display text-2xl font-black sm:text-3xl">Join the Phantom Squad</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Get drop alerts, exclusive Rwanda-only promos and esports news in your inbox.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); (e.currentTarget as HTMLFormElement).reset(); alert("Thanks for subscribing!"); }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email" required placeholder="you@example.com"
              className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
            <button className="h-12 rounded-md bg-gradient-brand px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
        <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl lg:text-4xl">{title}</h2>
      </div>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent sm:block" />
    </div>
  );
}
