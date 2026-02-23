import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Store, Package, Settings, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import ProductFormDialog from "@/components/dashboard/ProductFormDialog";
import DispensarySetup from "@/components/dashboard/DispensarySetup";

interface Dispensary {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  description: string | null;
  image_url: string | null;
  delivery_fee: number | null;
  delivery_time: string | null;
  is_open: boolean | null;
}

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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dispensary, setDispensary] = useState<Dispensary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch dispensary owned by this user
    const { data: disp } = await supabase
      .from("dispensaries")
      .select("*")
      .eq("owner_id", user!.id)
      .maybeSingle();

    if (disp) {
      setDispensary(disp as Dispensary);
      // Fetch products
      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("dispensary_id", disp.id)
        .order("created_at", { ascending: false });
      setProducts((prods as Product[]) || []);
    }
    setLoading(false);
  };

  const toggleOpen = async () => {
    if (!dispensary) return;
    const { error } = await supabase
      .from("dispensaries")
      .update({ is_open: !dispensary.is_open })
      .eq("id", dispensary.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setDispensary({ ...dispensary, is_open: !dispensary.is_open });
      toast.success(dispensary.is_open ? "Store closed" : "Store is now open!");
    }
  };

  const toggleProductAvailability = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      setProducts(products.map((p) =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p
      ));
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted");
    }
  };

  const handleProductSaved = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // If no dispensary yet, show setup
  if (!dispensary) {
    return <DispensarySetup onCreated={fetchData} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">{dispensary.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {dispensary.city || "No location set"} · {products.length} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOpen}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dispensary.is_open
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {dispensary.is_open ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {dispensary.is_open ? "Open" : "Closed"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border/40">
          {([
            { key: "products" as const, label: "Products", icon: Package },
            { key: "settings" as const, label: "Settings", icon: Settings },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-semibold">Menu</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <Store className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-semibold mb-1">No products yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first product to start selling</p>
                <button
                  onClick={() => setProductDialogOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-gradient text-sm font-semibold text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          product.strain === "Sativa"
                            ? "bg-primary/15 text-primary"
                            : product.strain === "Indica"
                            ? "bg-violet-500/15 text-violet-400"
                            : "bg-accent/15 text-accent"
                        }`}>
                          {product.strain}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · {product.weight || "N/A"} · THC {product.thc || "N/A"}
                      </p>
                    </div>

                    <span className="font-display font-bold">${Number(product.price).toFixed(2)}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleProductAvailability(product)}
                        className={`p-2 rounded-lg transition-colors ${
                          product.is_available
                            ? "text-primary hover:bg-primary/10"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                        title={product.is_available ? "Mark unavailable" : "Mark available"}
                      >
                        {product.is_available ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductDialogOpen(true);
                        }}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <DispensarySettings dispensary={dispensary} onUpdated={fetchData} />
        )}
      </div>

      <ProductFormDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        dispensaryId={dispensary.id}
        product={editingProduct}
        onSaved={handleProductSaved}
      />
    </div>
  );
}

function DispensarySettings({ dispensary, onUpdated }: { dispensary: Dispensary; onUpdated: () => void }) {
  const [name, setName] = useState(dispensary.name);
  const [address, setAddress] = useState(dispensary.address || "");
  const [city, setCity] = useState(dispensary.city || "");
  const [phone, setPhone] = useState(dispensary.phone || "");
  const [description, setDescription] = useState(dispensary.description || "");
  const [deliveryFee, setDeliveryFee] = useState(String(dispensary.delivery_fee || "3.99"));
  const [deliveryTime, setDeliveryTime] = useState(dispensary.delivery_time || "30-45 min");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("dispensaries")
      .update({
        name,
        address,
        city,
        phone,
        description,
        delivery_fee: parseFloat(deliveryFee),
        delivery_time: deliveryTime,
      })
      .eq("id", dispensary.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved!");
      onUpdated();
    }
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSave}
      className="glass-card p-6 max-w-xl space-y-4"
    >
      <h2 className="font-display text-xl font-semibold mb-4">Dispensary Settings</h2>

      {([
        { label: "Name", value: name, set: setName, required: true },
        { label: "Address", value: address, set: setAddress },
        { label: "City", value: city, set: setCity },
        { label: "Phone", value: phone, set: setPhone },
        { label: "Delivery Fee ($)", value: deliveryFee, set: setDeliveryFee, type: "number" },
        { label: "Delivery Time", value: deliveryTime, set: setDeliveryTime, placeholder: "e.g. 30-45 min" },
      ] as const).map((field) => (
        <div key={field.label}>
          <label className="block text-sm font-medium mb-1.5">{field.label}</label>
          <input
            type={(field as any).type || "text"}
            value={field.value}
            onChange={(e) => field.set(e.target.value)}
            required={(field as any).required}
            placeholder={(field as any).placeholder}
            maxLength={255}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/60 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-lg btn-gradient font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </motion.form>
  );
}
