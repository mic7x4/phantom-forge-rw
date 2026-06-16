import { Link } from "@tanstack/react-router";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";
import { categories } from "@/data/products";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Net Phantom Store" width={36} height={36} className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-widest text-gradient">NET PHANTOM</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">Store · Rwanda</div>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold transition hover:border-primary/60"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-brand px-1 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
