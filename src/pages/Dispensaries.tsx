import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DispensaryCard from "@/components/DispensaryCard";
import { DbDispensary } from "@/lib/types";
import { Store } from "lucide-react";

export default function Dispensaries() {
  const [dispensaries, setDispensaries] = useState<DbDispensary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("dispensaries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setDispensaries((data as DbDispensary[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-2">All Dispensaries</h1>
        <p className="text-muted-foreground mb-8">Licensed NJ cannabis dispensaries with delivery</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : dispensaries.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Store className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-1">No dispensaries yet</h3>
            <p className="text-sm text-muted-foreground">Check back soon for licensed dispensaries in your area</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dispensaries.map((d, i) => (
              <DispensaryCard key={d.id} dispensary={d} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
