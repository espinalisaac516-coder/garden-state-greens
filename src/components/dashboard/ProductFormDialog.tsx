import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  dispensary_id: string;
  name: string;
  category: string;
  strain: "Sativa" | "Indica" | "Hybrid";
  thc: string | null;
  price: number;
  weight: string | null;
  description: string | null;
  image_url: string | null;
  is_available: boolean | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispensaryId: string;
  product: Product | null;
  onSaved: () => void;
}

const categories = ["Flower", "Edibles", "Vapes", "Pre-Rolls", "Concentrates", "Tinctures", "Topicals"];
const strains: ("Sativa" | "Indica" | "Hybrid")[] = ["Sativa", "Indica", "Hybrid"];

export default function ProductFormDialog({ open, onOpenChange, dispensaryId, product, onSaved }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Flower");
  const [strain, setStrain] = useState<"Sativa" | "Indica" | "Hybrid">("Hybrid");
  const [thc, setThc] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setStrain(product.strain);
      setThc(product.thc || "");
      setPrice(String(product.price));
      setWeight(product.weight || "");
      setDescription(product.description || "");
      setImageUrl(product.image_url || "");
    } else {
      setName("");
      setCategory("Flower");
      setStrain("Hybrid");
      setThc("");
      setPrice("");
      setWeight("");
      setDescription("");
      setImageUrl("");
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      dispensary_id: dispensaryId,
      name: name.trim(),
      category,
      strain,
      thc: thc.trim() || null,
      price: parseFloat(price),
      weight: weight.trim() || null,
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
    };

    let error;
    if (product) {
      ({ error } = await supabase.from("products").update(data).eq("id", product.id));
    } else {
      ({ error } = await supabase.from("products").insert(data));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(product ? "Product updated!" : "Product added!");
      onSaved();
    }
    setSaving(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/60 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className={inputClass}
              placeholder="Blue Dream"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Strain *</label>
              <select
                value={strain}
                onChange={(e) => setStrain(e.target.value as typeof strain)}
                className={inputClass}
              >
                {strains.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className={inputClass}
                placeholder="45.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                maxLength={50}
                className={inputClass}
                placeholder="3.5g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">THC</label>
              <input
                type="text"
                value={thc}
                onChange={(e) => setThc(e.target.value)}
                maxLength={20}
                className={inputClass}
                placeholder="21%"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              className={`${inputClass} resize-none`}
              placeholder="Describe the product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              maxLength={500}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-lg border border-border/60 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg btn-gradient text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : product ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
