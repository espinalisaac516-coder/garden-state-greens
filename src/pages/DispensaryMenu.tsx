import { useParams, Link } from "react-router-dom";
import { dispensaries, products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import { useState } from "react";
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react";

export default function DispensaryMenu() {
  const { id } = useParams();
  const dispensary = dispensaries.find((d) => d.id === id);
  const [category, setCategory] = useState("All");

  if (!dispensary) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Dispensary not found</p>
      </div>
    );
  }

  // For demo, show all products for any dispensary
  const filtered = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <img src={dispensary.image} alt={dispensary.name} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <Link to="/dispensaries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{dispensary.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent fill-accent" />
                {dispensary.rating} ({dispensary.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {dispensary.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dispensary.deliveryTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${dispensary.isOpen ? "bg-primary animate-pulse" : "bg-destructive"}`} />
            <span className="text-sm">{dispensary.isOpen ? "Open Now" : "Closed"}</span>
          </div>
        </div>

        <CategoryBar selected={category} onSelect={setCategory} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No products in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
