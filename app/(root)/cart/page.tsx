import { APP_NAME } from "@/lib/constants";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata = {
    title: `Coș de cumpărături | ${APP_NAME}`
}


const CartPage = async() => {
    const cart = await getMyCart();

    return ( <>
    <CartTable cart={cart}/>
    </> );
}
 
export default CartPage;