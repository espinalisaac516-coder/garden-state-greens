import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Dispensary } from "@/lib/data";
import { motion } from "framer-motion";

interface Props {
  dispensary: Dispensary;
  index: number;
}

export default function DispensaryCard({ dispensary, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/dispensary/${dispensary.id}`}
        className="glass-card block overflow-hidden group hover:border-primary/30 transition-colors"
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={dispensary.image}
            alt={dispensary.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {!dispensary.isOpen && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                Closed
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
            <Star className="h-3 w-3 text-accent fill-accent" />
            {dispensary.rating}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-display font-semibold text-lg">{dispensary.name}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {dispensary.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {dispensary.deliveryTime}
            </span>
            <span>${dispensary.deliveryFee} delivery</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dispensary.categories.map((cat) => (
              <span key={cat} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-secondary-foreground">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
