import DispensaryCard from "@/components/DispensaryCard";
import { dispensaries } from "@/lib/data";

export default function Dispensaries() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-2">All Dispensaries</h1>
        <p className="text-muted-foreground mb-8">Licensed NJ cannabis dispensaries with delivery</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dispensaries.map((d, i) => (
            <DispensaryCard key={d.id} dispensary={d} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
