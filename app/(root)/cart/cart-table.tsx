"use client";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();

  // 🔹 track loading per productId & per action
  const [adding, setAdding] = useState<Set<string>>(new Set());
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  // 🔹 a separate transition only for the checkout button
  const [isNavPending, startNavTransition] = useTransition();

  const handleAdd = async (item: Cart["items"][number]) => {
    const pid = item.productId;
    setAdding((s) => new Set(s).add(pid));
    try {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message || "Failed to add item to cart.");
      }
    } finally {
      setAdding((s) => {
        const next = new Set(s);
        next.delete(pid);
        return next;
      });
    }
  };

  const handleRemove = async (pid: string) => {
    setRemoving((s) => new Set(s).add(pid));
    try {
      const res = await removeItemFromCart(pid);
      if (!res.success) {
        toast.error(res.message || "Failed to remove item from cart.");
      }
    } finally {
      setRemoving((s) => {
        const next = new Set(s);
        next.delete(pid);
        return next;
      });
    }
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty.{" "}
          <Link href="/" className="text-primary underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => {
                  const addBusy = adding.has(item.productId);
                  const removeBusy = removing.has(item.productId);
                  return (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={40}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        {/* 🔹 Real spacing + per-button spinners */}
                        <div className="inline-flex items-center justify-center gap-4">
                          <Button
                            disabled={removeBusy}
                            variant="outline"
                            type="button"
                            onClick={() => handleRemove(item.productId)}
                          >
                            {removeBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>

                          <span className="px-2 min-w-6 text-center">
                            {item.qty}
                          </span>

                          <Button
                            disabled={addBusy}
                            variant="outline"
                            type="button"
                            onClick={() => handleAdd(item)}
                          >
                            {addBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal({cart.items.reduce((a, c) => a + c.qty, 0)})
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>

              <Button
                className="w-full"
                disabled={isNavPending}
                onClick={() => {
                  startNavTransition(() => {
                    router.push("/shipping-address");
                  });
                }}
              >
                {isNavPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
