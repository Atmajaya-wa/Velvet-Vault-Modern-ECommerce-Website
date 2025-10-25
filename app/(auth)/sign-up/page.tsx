// app/(auth)/sign-up/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "../sign-up/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up - Velvet Vault",
};

// NOTE the Promise type for searchParams
type SignUpPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const session = await auth();

  // ✅ Next 15: await searchParams before accessing its fields
  const { callbackUrl = "/" } = await searchParams;

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link className="flex-center" href="/">
            <Image
              src="/Images/logo.svg"
              alt={APP_NAME}
              width={100}
              height={100}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up for a new account to continue to {APP_NAME}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
