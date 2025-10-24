// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { APP_NAME } from "@/lib/constants";
// import { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import CredentialsSignInForm from "./credentials-signin-form";
// import {auth} from "@/auth";
// import { redirect } from "next/navigation";

// export const metadata:Metadata={
//     title:'Sign In - Velvet Vault',
// }

// const SignInPage = async (props:{
//     searchParams: Promise<{
//     callbackUrl?: string
// }>}) => {
//     const session = await auth();
//     if (session){
//         return redirect(callbackUrl || '/');
//     }
//     return ( 
//         <div className="w-full max-w-md mx-auto">
//             <Card>
//                 <CardHeader className="space-y-4">
//                     <Link className="flex-center" href="/">
//                     <Image 
//                     src="/Images/logo.svg"
//                      alt={`${APP_NAME}`} 
//                      width={100} 
//                      height={100}
//                     priority={true}
//                     />
//                     </Link>
//                     <CardTitle className="text-center">Sign In</CardTitle>
//                     <CardDescription className="text-center">
//                         Sign in to your account to continue to {APP_NAME}
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {
//                         <CredentialsSignInForm />
//                     }

//                 </CardContent>
//             </Card>
//         </div>
//      );
// }
 
// export default SignInPage;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In - Velvet Vault",
};

type SignInPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const session = await auth();

  // searchParams is a plain object – no await
  const callbackUrl = searchParams?.callbackUrl ?? "/";

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
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue to {APP_NAME}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
