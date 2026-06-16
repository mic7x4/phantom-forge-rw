import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { formatRWF, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="card-glow card-glow-hover group relative overflow-hidden rounded-xl">
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-gradient-brand px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg">
          {product.badge}
        </span>
      )}
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="aspect-square overflow-hidden bg-background/40">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-widest text-primary">{product.brand}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {product.rating}
          </span>
        </div>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="font-display text-base font-bold text-foreground">{formatRWF(product.price)}</div>
            {product.oldPrice && (
              <div className="text-xs text-muted-foreground line-through">{formatRWF(product.oldPrice)}</div>
            )}
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              product.stock > 0 ? "text-emerald-400" : "text-destructive"
            }`}
          >
            {product.stock > 0 ? "In stock" : "Out"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            add(product.id);
            toast.success(`${product.name} added to cart`);
          }}
          disabled={product.stock === 0}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gradient-brand text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
