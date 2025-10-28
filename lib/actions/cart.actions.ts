// "use server";

// import { auth } from "@/auth";
// import { prisma } from "@/db/prisma";
// import { CartItem } from "@/types";
// import { cookies } from "next/headers";
// import { formatError } from "@/lib/utils";
// import { convertToPlainObject } from "../utils";
// import { cartItemSchema } from "../validators";

// export async function addItemToCart(data: CartItem) {
//   try {
//     // check for the cart cookies
//     const sessionCartId = (await cookies()).get("sessionCartId")?.value;

//     if (!sessionCartId) {
//       throw new Error("No session cart ID found.");
//     }

//     //Get Session Cart ID from cookies
//     const session = await auth();
//     const userId = session?.user?.id ? (session.user.id as string) : undefined;

//     // Get User Cart from database
//     const cart = await getMyCart();

//     // Parse nad validate item
//     const item = cartItemSchema.parse(data);

//     // Find product in databse
//     const product = await prisma.product.findFirst({
//       where: {
//         id: item.productId,
//       },
//     });

//     // TESTING
//     console.log({
//       "Session Cart Id ": sessionCartId,
//       "User Id ": userId,
//       "Product Found ": product,
//       "Item to add ": item,

//     });

//     return {
//       success: true,
//       message: `${data.name} unable to be added to cart`, // ✅ data থেকে কিছু দেখানো হচ্ছে
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: formatError(error),
//     };
//   }
// }

// export async function getMyCart() {
//   const sessionCartId = (await cookies()).get("sessionCartId")?.value;

//   if (!sessionCartId) {
//     throw new Error("No session cart ID found.");
//   }

//   //Get Session Cart ID from cookies
//   const session = await auth();
//   const userId = session?.user?.id ? (session.user.id as string) : undefined;

//   // Get User Cart from database

//   const cart = await prisma.cart.findFirst({
//     where: userId ? { userId } : { sessionCartId },
//   });
//   if (!cart) {
//     return undefined;
//   }

//   // Convert Decimals and return
//   return convertToPlainObject({
//     ...cart,
//     items: cart.items as CartItem[],
//     itemsPrice: cart.itemsPrice.toString(),
//     shippingPrice: cart.shippingPrice.toString(),
//     taxPrice: cart.taxPrice.toString(),
//     totalPrice: cart.totalPrice.toString(),
//   });
// }

"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { formatError, round2, convertToPlainObject } from "@/lib/utils";
import { cartItemSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/** Price math */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  // Prisma Decimal fields accept strings
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

type ActionResult = { success: boolean; message: string };

export async function addItemToCart(data: CartItem): Promise<ActionResult> {
  console.log("🟢 addItemToCart called with:", data);

  try {
    const cookieStore = await cookies();  
    const sessionCartId = cookieStore.get("sessionCartId")?.value;
    console.log("🔎 Session Cart Id:", sessionCartId);

    if (!sessionCartId) {
      console.warn("⚠️ No session cart ID found.");
      return { success: false, message: "No session cart ID found." };
    }

    // auth (optional, anonymous carts supported)
    const session = await auth();
    const userId = (session?.user?.id as string | undefined) ?? undefined;

    // validate payload
    const parsed = cartItemSchema.safeParse(data);
    if (!parsed.success) {
      console.warn("❌ cartItem validation failed:", parsed.error.issues);
      return { success: false, message: formatError(parsed.error) };
    }
    const item = parsed.data;

    // check product & stock source-of-truth
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) {
      return { success: false, message: "Product not found." };
    }

    // find existing cart
    const existingCart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    // get items[] as a plain array, even if DB stored null/empty
    const currentItems: CartItem[] = Array.isArray(existingCart?.items)
      ? (existingCart?.items as unknown as CartItem[])
      : [];

    // does item already exist?
    const idx = currentItems.findIndex((x) => x.productId === item.productId);

    if (idx >= 0) {
      // increment with stock guard
      const nextQty = currentItems[idx].qty + 1;
      if (nextQty > product.stock) {
        return { success: false, message: "Not enough stock." };
      }
      currentItems[idx] = { ...currentItems[idx], qty: nextQty };
    } else {
      // add new with stock guard
      if (product.stock < 1) {
        return { success: false, message: "Not enough stock." };
      }
      currentItems.push(item);
    }

    const totals = calcPrice(currentItems);

    if (!existingCart) {
      // create new cart
      await prisma.cart.create({
        data: {
          userId: userId ?? null,
          sessionCartId,
          items: currentItems as unknown as Prisma.InputJsonValue,
          ...totals,
        },
      });
    } else {
      // update existing
      await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          items: currentItems as unknown as Prisma.InputJsonValue,
          ...totals,
        },
      });
    }

    // Revalidate pages that show cart or product details

    revalidatePath("/cart");
    revalidatePath(`/product/${product.slug}`);

    const wasExisting = idx >= 0;
    const actionMessage = wasExisting
      ? `has been updated in your cart.`
      : `has been added to your cart.`;

    return { success: true, message: actionMessage };
  } catch (error) {
    console.error("🧨 addItemToCart failed:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function getMyCart() {
  try {
    const cookieStore = await cookies();                       // ← change
    const sessionCartId = cookieStore.get("sessionCartId")?.value; 

    if (!sessionCartId) {
      console.warn("⚠️ getMyCart: No session cart ID found.");
      return undefined;
    }

    const session = await auth();
    const userId = (session?.user?.id as string | undefined) ?? undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) return undefined;

    return convertToPlainObject({
      ...cart,
      items: (Array.isArray(cart.items) ? cart.items : []) as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
    });
  } catch (error) {
    console.error("getMyCart error:", error);
    return undefined;
  }
}

export async function removeItemFromCart(productId: string) {
try{
      const cookieStore = await cookies();                       // ← change
    const sessionCartId = cookieStore.get("sessionCartId")?.value; 
     if (!sessionCartId) {
      throw new Error("No session cart ID found.");
    }

    // Get product 
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new Error("Product not found.");
    }

    // Get User Cart from database
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found.");
    }

    //Check if item exists in cart
    const exist  = (cart.items || []).find((x) => x.productId === productId);
    if (!exist) {
      throw new Error("Item not found in cart.");
    }

    // Check if only one in qty
    if(exist.qty === 1){
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
    } else{
      // Decrement qty
       (cart.items as CartItem[]).find((x) => x.productId === exist.productId)!.qty = exist.qty - 1;
    }

    // Update cart in databse
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        // items: cart.items,
        // itemsPrice: cart.itemsPrice,
        // shippingPrice: cart.shippingPrice,
        // taxPrice: cart.taxPrice,
        // totalPrice: cart.totalPrice,
        items: cart.items as unknown as Prisma.InputJsonValue,
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    // Revalidate pages that show cart or product details

    // revalidatePath("/cart");
    revalidatePath(`/product/${product.slug}`);
    return {success: true, message: `${product.name} has been removed from cart.`};
}
catch(error){
  return {success: false, message: formatError(error)};
}
}
