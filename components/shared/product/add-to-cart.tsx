"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message || "Something went wrong.");
        return;
      }

      toast.custom(
        (t) => (
          <div
            className="pointer-events-auto flex w-full max-w-5xl items-center justify-between
                       gap-6 rounded-2xl border border-border/50 bg-white/95
                       dark:bg-neutral-900/90 px-8 py-6 shadow-lg backdrop-blur-md"
          >
            {/* ✅ Large green tick icon */}
            <div className="flex items-start gap-5 flex-1 min-w-0">
              <CheckCircle2 className="h-9 w-9 text-green-600 flex-shrink-0 mt-1" />

              {/* Text block — fixed width so it doesn’t wrap weirdly */}
              <div className="flex flex-col w-full truncate">
                <p className="text-[17px] font-semibold text-foreground leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </p>
                <p className="text-[15px] text-muted-foreground whitespace-nowrap">
                  has been added to your cart.
                </p>
              </div>
            </div>

            {/* 🛒 'Go to Cart' button — blackish gray */}
            <button
              onClick={() => {
                router.push("/cart");
                toast.dismiss(t);
              }}
              className="rounded-lg text-nowrap bg-neutral-900 text-white px-3 py-2 text-[15px] font-semibold
                         shadow-sm hover:bg-neutral-800 hover:shadow-md active:scale-[0.97]
                         transition-all"
            >
              Go to Cart
            </button>
          </div>
        ),
        {
          duration: 4000,
          position: "bottom-right",
        }
      );
    } catch {
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus className="mr-2 h-4 w-4" aria-hidden />
      Add to Cart
    </Button>
  );
};

export default AddToCart;
