'use server';

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
   const itemsPrice = round2(
      items.reduce((acc,item) => acc + Number(item.price) * item.qty, 0)
   ),
   shippingPrice = round2(itemsPrice > 200 ? 0 : 20),
   taxPrice = 5, //taxa de ambalare
   totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
   
   return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
   }

} 

export async function addItemToCart(data: CartItem){
   try{
      //Verificam cookie pt cosul de cumparaturi
      const sessionCartId = (await cookies()).get('sessionCartId')?.value;
      if(!sessionCartId) throw new Error('Sesiunea pentru cosul de cumparaturi nu a fost gasita.');

      //session si user id
      const session = await auth();
      const userId = session?.user?.id ? (session.user.id as string) : undefined;

      //Cosul de cumparaturi
      const cart = await getMyCart();
      const item = cartItemSchema.parse(data);

      const product = await prisma.product.findFirst({
         where: {id: item.productId}
      })

      if(!product) throw new Error('Produsul nu se poate gasi.');
      if(!cart){
         const newCart = insertCartSchema.parse({
            userId: userId,
            items:[item],
            sessionCartId: sessionCartId,
            ...calcPrice([item])
         });
         
         // Adaugam in database
         await prisma.cart.create({
            data: newCart
         });
         revalidatePath(`/product/${product.slug}`);

         return {
            success:true,
            message: `${product.name} adaugat cu succes.`,
         };

      }
      else {
         //Verificam daca produsul este deja in cos
         const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

         if(existItem){
            //Verificam stocul 
            if(product.stock < existItem.qty + 1){
               throw new Error("Din pacate produsul nu mai este pe stoc.");
            }
            //Daca e in stoc crestem cantitatea
            (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1;

         }
         else
         {
            // Daca produsul nuexista in cos
            //Verificam stocul
            if(product.stock < 1) throw new Error("Din pacate produsul nu mai este pe stoc.");

            //Adaugam la cart.items
            cart.items.push(item);
         }
         //Salvam in baza de date
         await prisma.cart.update({
            where: {id: cart.id},
            data: {
               items: cart.items as Prisma.CartUpdateitemsInput[],
               ...calcPrice(cart.items as CartItem[])
            }
         });
         
         revalidatePath(`/product/${product.slug}`);

         return {
            success: true,
            message: `${product.name} ${existItem ? 'a fost actualizat in' : 'a fost adaugat in'} cos.`
         }


          }

      
   } catch (error){
      return{
         success:false,
         message:formatError(error)
      }
   }
}

export async function getMyCart() {
    //Verificam cookie pt cosul de cumparaturi
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error('Sesiunea pentru cosul de cumparaturi nu a fost gasita.');

    //session si user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    //Cosul de cumparaturi a utilizatorului din database
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId : userId} : {sessionCartId: sessionCartId} 
    });

    if(!cart) return undefined;

    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    })

}