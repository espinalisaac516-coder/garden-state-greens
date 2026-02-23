import { useState } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Flower", "Edibles", "Vapes", "Pre-Rolls", "Concentrates"];

interface Props {
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryBar({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selected === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {selected === cat && (
            <motion.div
              layoutId="categoryPill"
              className="absolute inset-0 rounded-full btn-gradient"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}
