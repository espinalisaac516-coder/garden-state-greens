import { Plus } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

interface Props {
  product: Product;
  index: number;
}

const strainColors: Record<string, string> = {
  Sativa: "bg-primary/15 text-primary",
  Indica: "bg-violet-500/15 text-violet-400",
  Hybrid: "bg-accent/15 text-accent",
};

export default function ProductCard({ product, index }: Props) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card overflow-hidden group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium ${strainColors[product.strain]}`}>
          {product.strain}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-display font-semibold">{product.name}</h4>
            <p className="text-xs text-muted-foreground">{product.category} · {product.weight}</p>
          </div>
          <span className="text-xs text-muted-foreground">THC {product.thc}</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-display font-bold text-lg">${product.price}</span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-gradient text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
