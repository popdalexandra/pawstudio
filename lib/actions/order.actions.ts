'use server';

import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.action';
import { convertToPlainObject, formatError } from '../utils';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { CartItem, PaymentResult, ShippingAddress } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';
import { sendPurchaseReceipt } from '@/email';



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
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
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
  paymentResult?: PaymentResult;
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


  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    }
  })

}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };

}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query
  
}: {
  limit?: number;
  page: number;
  query: string;
}){

  const queryFilter: Prisma.OrderWhereInput =
  query && query !== 'all'
    ? {
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        },
      }
    : {};

const data = await prisma.order.findMany({
  where: {
    ...queryFilter,
  },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: (page - 1) * limit,
  include: { user: { select: { name: true } } },
});

const dataCount = await prisma.order.count();

return {
  data,
  totalPages: Math.ceil(dataCount / limit),
};
}


// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Comanda a fost ștearsă cu succes.',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Comandă marcată ca plătită' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    // if (!order) throw new Error('Comanda nu a fost găsită');
    // if (!order.isPaid ) throw new Error('Comanda nu este plătită');


    if (!order) throw new Error('Comanda nu a fost găsită');
    if (order.isDelivered) throw new Error('Comanda este deja livrată');

    // Permitem livrarea pentru comenzile cu metoda de plată "Numerar" chiar dacă nu sunt plătite
    if (!order.isPaid && order.paymentMethod !== 'Numerar') {
      throw new Error('Comanda nu este plătită și nu poate fi livrată');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Comandă marcată ca livrată.',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}