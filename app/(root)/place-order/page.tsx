import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.action';
import { ShippingAddress } from '@/types';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
    title: `Finalizare comandă | ${APP_NAME}`
}

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('Utilizatorul nu a fost găsit.');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className='py-4 text-2xl'>Finalizare comandă</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Adresa de livrare</h2>
              <p>{userAddress.fullName}</p>
              <p>{userAddress.phoneNumber}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.postalCode}, {userAddress.country}{' '}
              </p>
              <div className='mt-3'>
                <Link href='/shipping-address'>
                  <Button className="border border-pink-300 hover:border-pink-500" variant='outline'>Editează</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Metoda de plată</h2>
              <p>{user.paymentMethod}</p>
              <div className='mt-3'>
                <Link href='/payment-method'>
                  <Button className="border border-pink-300 hover:border-pink-500" variant='outline'>Editează</Button>
                </Link>
              </div>
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
                  {cart.items.map((item) => (
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
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Taxă de împachetare</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Transport</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
               <PlaceOrderForm /> 
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;