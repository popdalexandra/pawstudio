'use client'
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart } from "@/lib/actions/cart.actions";


const AddToCarrt = ({item}: {item: CartItem}) => {
    const router = useRouter();
    const {toast} = useToast();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if(!res.success){
            toast({
                variant: 'destructive',
                description:res.message
            });
            return;
        }
        //Handle success add to cart
        toast({
            description:res.message,
            action: (
                <ToastAction className="bg-primary text-white hover:bg-pink-800" altText='Cos de cumparaturi' onClick={() => router.push('/cart') }>
                    Finalizeaza comanda
                </ToastAction>
            )
        })
    } 

    return <Button className="w-full hover:bg-pink-700" type='button' onClick= {handleAddToCart}><Plus/>Adauga in cos</Button> 
};
 
export default AddToCarrt;