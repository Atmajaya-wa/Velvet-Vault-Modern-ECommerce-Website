// lib/actions/user.actions.ts
"use server";

import { auth, signIn, signOut } from "@/auth";
import { shippingAddressSchema, signInFormSchema, signUpFormSchema,paymentMethodSchema } from "@/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Prisma } from "@prisma/client";
import z from "zod";



/** Sign in */
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "Error occurred, Invalid email or password!" };
  }
}

/** Sign out */
export async function signOutUser() {
  await signOut();
}

/** Sign up */
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    // IMPORTANT: use plain password for credentials sign-in
    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "Sign up successful" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

/** Get user by ID */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

/** Update user shipping address (stores ONE JSON object in `addresses`) */
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });
    if (!currentUser) {
      throw new Error("User not found");
    }

    const address = shippingAddressSchema.parse(data);

    // 👉 NOTE: Prisma JSON ফিল্ডে লিখতে InputJsonValue কাস্ট করুন
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        // আমরা single address রাখছি। চাইলে এখানে arrayও রাখতে পারেন।
        addresses: address as unknown as Prisma.InputJsonValue,
      },
    });

    return { success: true, message: "Shipping address updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user payment method
export async function updateUserPaymentMethod(data:z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) {
      throw new Error("User not found");
    }
    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return { success: true, message: "Payment method updated successfully" };
    
}
catch (error) {
    return { success: false, message: formatError(error) };
  }
}
  