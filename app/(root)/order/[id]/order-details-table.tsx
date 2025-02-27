'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder
} from '@/lib/actions/order.actions';
import StripePayment from './stripe-payment';


const OrderDetailsTable = ({order, paypalClientId, isAdmin, stripeClientSecret,}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {

    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt,
      } = order;
    
      const { toast } = useToast();

      const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();
        let status = '';
    
        if (isPending) {
          status = 'Se încarcă PayPal...';
        } else if (isRejected) {
          status = 'A apărut o eroare la procesarea plății prin PayPal.';
        }
        return status;
      };
    
      const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order.id);
    
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          });
        }
    
        return res.data;
      };
    
      const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrder(order.id, data);
    
        toast({
          variant: res.success ? 'default' : 'destructive',
          description: res.message,
        });
      };

       // Button to mark order as paid
       const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
      
        return (
          <Button
          className=" hover:bg-pink-700"
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await updateOrderToPaidCOD(order.id);
                toast({
                  variant: res.success ? 'default' : 'destructive',
                  description: res.message,
                });
              })
            }
          >
            {isPending ? '...' : 'Marchează ca plătit'}
          </Button>
        );
      };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
  
    return (
      <Button className=" hover:bg-pink-700"
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? '...' : 'Marchează ca livrat'}
      </Button>
    );
  };

    return ( 
        <>
        <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
        <div className='grid md:grid-cols-3 md:gap-5'>
          <div className='col-span-2 space-4-y overlow-x-auto'>
            <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Metoda de plată</h2>
                <p className='mb-2'>{paymentMethod}</p>
                {isPaid ? (
                  <Badge variant='secondary'>
                    Plătită la {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Neplătită</Badge>
                )}
              </CardContent>
            </Card>
            <Card className='my-2'>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Adresa de livrare</h2>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.phoneNumber}</p>
                <p className='mb-2'>
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {isDelivered ? (
                  <Badge variant='secondary'>
                    Livrată la {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Nelivrată</Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Produse</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produs</TableHead>
                      <TableHead>Cantitate</TableHead>
                      <TableHead className='text-right'>Preț</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className='flex items-center'
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                            <span className='px-2'>{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className='px-2'>{item.qty}</span>
                        </TableCell>
                        <TableCell className='text-right'>
                          {item.price} RON
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 gap-4 space-y-4'>
                <div className='flex justify-between'>
                  <div>Produse</div>
                  <div>{formatCurrency(itemsPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Taxă de împachetare</div>
                  <div>{formatCurrency(taxPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Transport</div>
                  <div>{formatCurrency(shippingPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Total</div>
                  <div>{formatCurrency(totalPrice)}</div>
                </div>

                {/*Plata cu PayPal*/}

                {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState/>
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                  <p className="text-xs text-gray-500"> Prețul afișat include taxe.<br/>Toate plățile efectuate prin PayPal vor fi procesate în EUR(€). <br/>Conversia din RON în EUR se realizează folosind un curs valutar fix de 1 RON = 0.207 USD.
              <br/>Vă rugăm să verificați suma finală afișată în PayPal înainte de confirmarea plății.</p>
                </div>
              )}

                {/* Stripe Payment */}
                {!isPaid && paymentMethod === 'Card de credit' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}

              {/*Cash On Delivery */}

              {isAdmin && !isDelivered && paymentMethod === 'Numerar' && (
                <MarkAsDeliveredButton />
              )}
              {isAdmin && isDelivered && !isPaid && paymentMethod === 'Numerar' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && paymentMethod !== 'Numerar' && (
                <MarkAsDeliveredButton />
              )}

              
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
}
 
export default OrderDetailsTable;
