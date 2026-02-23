import HeroSection from "@/components/HeroSection";
import DispensaryCard from "@/components/DispensaryCard";
import { dispensaries } from "@/lib/data";
import { motion } from "framer-motion";
import { Truck, Shield, Clock } from "lucide-react";

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Under 1 hour to your door" },
  { icon: Shield, title: "Licensed & Legal", desc: "NJ state-licensed dispensaries" },
  { icon: Clock, title: "Real-Time Tracking", desc: "Know exactly where your order is" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features */}
      <section className="py-16 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-start gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg btn-gradient shrink-0">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dispensaries */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Nearby Dispensaries</h2>
              <p className="text-muted-foreground mt-1">Browse licensed dispensaries delivering to you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dispensaries.map((d, i) => (
              <DispensaryCard key={d.id} dispensary={d} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
