'use server';

import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.action';
import { convertToPlainObject, formatError } from '../utils';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { CartItem, paymentResult } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';


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


  // Create new paypal order
  export async function createPayPalOrder(orderId: string) {
    try {
      // Get order from database
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
        },
      });
  
      if (order) {
        // Create paypal order
        const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
  
        // Update order with paypal order id
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentResult: {
              id: paypalOrder.id,
              email_address: '',
              status: '',
              pricePaid: 0,
            },
          },
        });
  
        return {
          success: true,
          message: 'Produsele comenzii au fost adăugate cu succes.',
          data: paypalOrder.id,
        };
      } else {
        throw new Error('Comanda nu a fost găsită.');
      }
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }
  
  // Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Comanda nu a fost găsită.');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as paymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Eroare la plata prin PayPal.');
    }

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Comanda dvs. a fost plătită.',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: paymentResult;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error('Comanda nu a fost găsită.');

  if (order.isPaid) throw new Error('Comanda dvs. este deja plătită.');

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Comanda nu a fost găsită.');

}