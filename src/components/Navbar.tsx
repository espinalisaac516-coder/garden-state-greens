import { ShoppingBag, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg btn-gradient">
            <span className="text-lg font-bold text-primary-foreground">🌿</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            NJ<span className="text-gradient">Greens</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full bg-secondary px-4 py-2 flex-1 max-w-md mx-8">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dispensaries, products..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Newark, NJ</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full btn-gradient text-xs font-bold text-primary-foreground"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
