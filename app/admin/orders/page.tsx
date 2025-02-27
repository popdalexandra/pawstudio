import { APP_NAME } from "@/lib/constants";
import { auth } from '@/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from "@/components/shared/product/delete-dialog";


export const metadata = {
    title: `Rapoarte | ${APP_NAME}`
}


const AdminOrdersPage = async (props: {
    searchParams: Promise<{ page: string; query: string }>;
  }) => {
    const { page = '1', query: searchText } = await props.searchParams;
  
    const session = await auth();
  
    if (session?.user?.role !== 'admin')
      throw new Error('User is not authorized');
  
    const orders = await getAllOrders({
      page: Number(page),
      query: searchText
    });
  
    return (
      <div className='space-y-2'>
        <div className="flex items-center gap-8">
          <h1 className="h2-bold">Comenzi</h1>
          {searchText && (
            <div className="flex items-center gap-3">
              Filtrat după <i>&quot;{searchText}&quot;</i>{' '}
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Șterge filtrul
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATA</TableHead>
                <TableHead>NUME</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PLATA</TableHead>
                <TableHead>LIVRARE</TableHead>
                <TableHead>DETALII</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell className={`${!order.isPaid ? 'text-red-500' : ''}`}>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : 'Neplătit'}
                  </TableCell>
                  <TableCell className={`${!order.isDelivered ? 'text-red-500' : ''}`}>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : 'Nelivrat'}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/order/${order.id}`}>Detalii</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} /> 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders?.totalPages}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default AdminOrdersPage;