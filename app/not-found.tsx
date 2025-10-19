'use clinet'

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
    return <div className="flex flex-col items-center justify-center min-h-screen">
        <Image 
        src='/images/logo.svg' 
        alt={`${APP_NAME} logo`} 
        priority={true} 
        width={62} 
        height={62}
        >
        </Image>

        <div className="p-6 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold mb-4">Not Found</h1>
            <p className="text-destructive">This page could not be found.</p>
            <Button 
            asChild
            variant='outline' 
            className="mt-4 ml-2" 
            >
                <Link href="/">Back To Home</Link>
            </Button>

        </div>
    </div>;
}
 
export default NotFoundPage;