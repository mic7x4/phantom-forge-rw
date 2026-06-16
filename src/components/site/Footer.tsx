import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
            <div>
              <div className="font-display font-bold tracking-widest text-gradient">NET PHANTOM</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Store · Rwanda</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Rwanda's premium destination for gaming PCs, consoles, accessories and esports gear. Built by gamers, for gamers.
          </p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/$slug" params={{ slug: "gaming-pcs" }} className="hover:text-primary">Gaming PCs</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "laptops" }} className="hover:text-primary">Laptops</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "consoles" }} className="hover:text-primary">Consoles</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "accessories" }} className="hover:text-primary">Accessories</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "components" }} className="hover:text-primary">Components</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">About Us</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />KN 4 Avenue, Kigali, Rwanda</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />+250 788 000 000</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" />hello@netphantom.rw</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="rounded-md border border-border bg-background px-2 py-1">MTN MoMo</span>
            <span className="rounded-md border border-border bg-background px-2 py-1">Airtel Money</span>
            <span className="rounded-md border border-border bg-background px-2 py-1">Visa</span>
            <span className="rounded-md border border-border bg-background px-2 py-1">Mastercard</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Net Phantom Store Rwanda. All rights reserved.</p>
          <p>Same-day delivery in Kigali · Nationwide shipping</p>
        </div>
      </div>
    </footer>
  );
}
