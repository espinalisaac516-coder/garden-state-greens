import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, total, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-background border-border/40 w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Order</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-30" />
            <p className="text-lg">Your bag is empty</p>
            <p className="text-sm">Add items from a dispensary to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-3 flex gap-3"
                  >
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-muted-foreground text-xs">🌿</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.product.weight}</p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border/40 pt-4 space-y-3 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NJ Tax</span>
                <span>${(total * 0.0662).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-semibold border-t border-border/40 pt-3">
                <span>Total</span>
                <span className="text-gradient">${(total + 3.99 + total * 0.0662).toFixed(2)}</span>
              </div>
              <button className="w-full py-3 rounded-xl btn-gradient font-display font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Place Order
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
