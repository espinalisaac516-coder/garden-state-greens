import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Store } from "lucide-react";

export default function DispensarySetup({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("dispensaries").insert({
      owner_id: user.id,
      name,
      city,
      address,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Dispensary created!");
      onCreated();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl btn-gradient flex items-center justify-center">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-center mb-1">Set Up Your Dispensary</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Create your dispensary to start listing products
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Dispensary Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="Garden State Greens"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="Newark, NJ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={255}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="420 Main St"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-gradient font-display font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Dispensary"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
