import { Star, Clock, MapPin, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { DbDispensary } from "@/lib/types";
import { motion } from "framer-motion";

interface Props {
  dispensary: DbDispensary;
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
          {dispensary.image_url ? (
            <img
              src={dispensary.image_url}
              alt={dispensary.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Store className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {!dispensary.is_open && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                Closed
              </span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-display font-semibold text-lg">{dispensary.name}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {dispensary.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {dispensary.city}
              </span>
            )}
            {dispensary.delivery_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dispensary.delivery_time}
              </span>
            )}
            {dispensary.delivery_fee != null && (
              <span>${Number(dispensary.delivery_fee).toFixed(2)} delivery</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
