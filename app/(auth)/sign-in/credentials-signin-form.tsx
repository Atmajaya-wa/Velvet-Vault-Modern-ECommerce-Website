"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import {  useActionState } from "react";
import { useFormStatus } from "react-dom";
import {signInWithCredentials} from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
    const [data,action]=useActionState(signInWithCredentials,{
        success:false,
        message:''
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignInButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button className="w-full" variant="default" disabled={pending}>
            {pending ? 'Signing In...' : 'Sign In'}
          </Button>
        )
    }
  return (
    <form action={action}>
        
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-3">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password"  className="mb-3">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div>
          <SignInButton />
        </div>
        {
            data && !data.success && ( 
            <div className="text-destructive text-center ">
                {data.message}
            </div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" 
            target="_self"
            className="link text-orange-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
