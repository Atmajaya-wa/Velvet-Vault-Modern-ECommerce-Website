"use client";

import { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  cartItems?: CartItem[];
  item: CartItem;
};

const AddToCart = ({ cartItems = [], item }: Props) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || isRemoving) return; // guard against double-clicks
    setIsAdding(true);
    try {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message || "Something went wrong.");
        return;
      }
      toast.custom(
        (t) => (
          <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-6 rounded-2xl border border-border/50 bg-white/95 dark:bg-neutral-900/90 px-8 py-6 shadow-lg backdrop-blur-md">
            <div className="flex items-start gap-5 flex-1 min-w-0">
              <CheckCircle2 className="h-9 w-9 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex flex-col w-full truncate">
                <p className="text-[17px] font-semibold text-foreground leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </p>
                <p className="text-[15px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {res.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                router.push("/cart");
                toast.dismiss(t);
              }}
              className="rounded-lg text-nowrap bg-neutral-900 text-white px-3 py-2 text-[15px] font-semibold shadow-sm hover:bg-neutral-800 hover:shadow-md active:scale-[0.97] transition-all"
            >
              Go to Cart
            </button>
          </div>
        ),
        { duration: 4000, position: "bottom-right" }
      );
    } catch {
      toast.error("Failed to add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (isAdding || isRemoving) return;
    setIsRemoving(true);
    try {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Failed to remove item from cart.");
      }
    } catch {
      toast.error("Failed to remove item from cart.");
    } finally {
      setIsRemoving(false);
    }
  };

  const existItem = cartItems.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={handleRemoveFromCart}
        disabled={isAdding || isRemoving}
        className="bg-black text-white hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-70"
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Minus className="h-4 w-4" aria-hidden />
        )}
      </Button>

      <span className="px-2 text-lg font-medium">{existItem.qty}</span>

      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || isRemoving}
        className="bg-black text-white hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-70"
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Plus className="h-4 w-4" aria-hidden />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding || isRemoving}
    >
      {isAdding ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Plus className="mr-2 h-4 w-4" aria-hidden />
      )}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
