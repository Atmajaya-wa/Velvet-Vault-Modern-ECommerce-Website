import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { ShoppingCart, UserIcon } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";


const Menu = () => {
    return (<div className="flex justify-end gap-3">


        <nav className="hidden md:flex w-full max-w-xs gap-1">
                 {/* Mode toggle stands alone */}
          <ModeToggle />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart /> Cart
            </Link>
          </Button>

          <Button asChild>
            <Link href="/sign-in">
              <UserIcon /> Sign In
            </Link>
          </Button>
        </nav>

        <nav className="md:hidden">
            <Sheet>
                
            </Sheet>
        </nav>

    </div>
    
);
}
 
export default Menu;