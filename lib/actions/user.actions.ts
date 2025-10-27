// lib/actions/user.actions.ts
'use server';

import { signIn, signOut } from "@/auth";
// import { signInFormSchema} from "../validators";
import { signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user); // plain password is correct here
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "Error occurred, Invalid email or password!" };
  }
}

export async function signOutUser() {
  await signOut();
}

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

    // IMPORTANT: pass the PLAIN password for Credentials sign-in
    await signIn("credentials", {
      email: user.email,
      password: user.password,
      // optionally: redirectTo: formData.get("callbackUrl") ?? "/",
    });

    return { success: true, message: "Sign up successful" };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // formatError is now sync; no Promise leaks
    return { success: false, message: formatError(error) };
  }
}
