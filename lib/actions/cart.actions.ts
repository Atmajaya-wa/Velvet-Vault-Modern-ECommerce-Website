

'use server'

import { CartItem } from '@/types'

export async function addItemToCart(data: CartItem) {
//   console.log('Adding item to cart:', data) // ✅ ব্যবহার করা হলো

  return {
    success: true,
    message: `${data.name} added to cart`, // ✅ data থেকে কিছু দেখানো হচ্ছে
  }
}

// app/api/cart/route.ts
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   // const payload = await request.json(); // validate/persist later
//   return NextResponse.json(
//     { success: true, message: "Item added to cart" },
//     { status: 200 }
//   );
// }
