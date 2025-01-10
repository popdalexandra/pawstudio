'use server';

import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.action';
import { convertToPlainObject, formatError } from '../utils';
import { insertOrderSchema } from '../validators';
import { CartItem } from '@/types';
import { prisma } from '@/db/prisma';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

// Create order and create the order items
export async function createOrder() {
    try {
      const session = await auth();
      if (!session) throw new Error('Utilizatorul nu este autentificat.');
  
      const cart = await getMyCart();
      const userId = session?.user?.id;
      if (!userId) throw new Error('Utilizatorul nu a fost gasit.');
  
      const user = await getUserById(userId);
  
      if (!cart || cart.items.length === 0) {
        return {
          success: false,
          message: 'Coșul de cumpărături este gol.',
          redirectTo: '/cart',
        };
      }
  
      if (!user.address) {
        return {
          success: false,
          message: 'Nu ați introdus o adresă de livrare.',
          redirectTo: '/shipping-address',
        };
      }
  
      if (!user.paymentMethod) {
        return {
          success: false,
          message: 'Nu ați ales o modalitate de plată.',
          redirectTo: '/payment-method',
        };
      }

       // Create order object
    const order = insertOrderSchema.parse({
        userId: user.id,
        shippingAddress: user.address,
        paymentMethod: user.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });

       // Create a transaction to create order and order items in database
        const insertedOrderId = await prisma.$transaction(async (tx) => {
        // Create order
        const insertedOrder = await tx.order.create({ data: order });
        // Create order items from the cart items
        for (const item of cart.items as CartItem[]) {
          await tx.orderItem.create({
            data: {
              ...item,
              price: item.price,
              orderId: insertedOrder.id,
            },
          });
        }
    
         // Clear cart
            await tx.cart.update({
            where: { id: cart.id },
                data: {
                items: [],
                totalPrice: 0,
                taxPrice: 0,
                shippingPrice: 0,
                itemsPrice: 0,
            },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Comanda nu a putut fi înregistrată.');
    return {
        success: true,
        message: 'Comanda a fost plasată cu succes.',
        redirectTo: `/order/${insertedOrderId}`,
      };

    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { success: false, message: formatError(error) };
      }
    }

    // Get order by id
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });
  
    return convertToPlainObject(data);
  }