"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import {  useActionState } from "react";
import { useFormStatus } from "react-dom";
import {signUpUser} from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
    const [data,action]=useActionState(signUpUser,{
        success:false,
        message:''
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignUpButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button className="w-full" variant="default" disabled={pending}>
            {pending ? 'Submitting...' : 'Sign Up'}
          </Button>
        )
    }
  return (
    <form action={action}>
        
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="mb-3">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email" className="mb-3">Email</Label>
          <Input
            type="text"
            id="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword"  className="mb-3">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <SignUpButton />
        </div>
        {
            data && !data.success && ( 
            <div className="text-destructive text-center ">
                {data.message}
            </div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" 
            target="_self"
            className="link text-orange-500 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
