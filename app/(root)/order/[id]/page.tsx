import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import Stripe from 'stripe';

import { APP_NAME } from "@/lib/constants";

export const metadata = {
    title: `Detalii comandă | ${APP_NAME}`
}

const OrderDetailsPage = async (props: {
    params: Promise<{
      id: string;
    }>;
  }) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if (!order) notFound();

    const session = await auth();


    let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Card de credit' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'RON',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  
    return (<OrderDetailsTable order = {{  ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,  }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user?.role === 'admin' || false}
        />);
}
 
export default OrderDetailsPage;