import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
    return  <div className="flex justify-end gap-3">
    {/* Pentru ecran larg */}
    <nav className="hidden md:flex gap-3 items-center">
        <ModeToggle />
        <Button asChild variant="ghost">
            <Link href="/cart">
                <ShoppingCart /> Cos de cumpărături
            </Link>
        </Button>
        <UserButton/>
    </nav>
 {/* Pentru ecran ingust */}
    <nav className="md:hidden">
        <Sheet>
            <SheetTrigger className="align-middle">
                <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start gap-4">
                <SheetTitle>Meniu</SheetTitle>
                <ModeToggle />
                <Button asChild variant="ghost">
                    <Link href="/cart">
                        <ShoppingCart /> Cos de cumpărături
                    </Link>
                </Button>
                <UserButton/>
                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    </nav>
</div>
}
 
export default Menu;