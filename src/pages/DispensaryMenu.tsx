import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DbDispensary, DbProduct } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import { ArrowLeft, Clock, MapPin, Store } from "lucide-react";

export default function DispensaryMenu() {
  const { id } = useParams();
  const [dispensary, setDispensary] = useState<DbDispensary | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function load() {
      const { data: disp } = await supabase
        .from("dispensaries")
        .select("*")
        .eq("id", id!)
        .maybeSingle();

      if (disp) {
        setDispensary(disp as DbDispensary);
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("dispensary_id", disp.id)
          .eq("is_available", true)
          .order("created_at", { ascending: false });
        setProducts((prods as DbProduct[]) || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!dispensary) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Dispensary not found</p>
          <Link to="/dispensaries" className="text-primary text-sm hover:underline mt-2 inline-block">
            Browse all dispensaries
          </Link>
        </div>
      </div>
    );
  }

  const filtered = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        {dispensary.image_url ? (
          <img src={dispensary.image_url} alt={dispensary.name} className="w-full h-full object-cover opacity-40" />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
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
              {dispensary.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {dispensary.city}
                </span>
              )}
              {dispensary.delivery_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {dispensary.delivery_time}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${dispensary.is_open ? "bg-primary animate-pulse" : "bg-destructive"}`} />
            <span className="text-sm">{dispensary.is_open ? "Open Now" : "Closed"}</span>
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
            <p>No products {category !== "All" ? "in this category " : ""}yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
