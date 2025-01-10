import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
//import { auth } from '@/auth';
//import Stripe from 'stripe';

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
  
    return (<OrderDetailsTable order = {{  ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,  }}/>);
}
 
export default OrderDetailsPage;