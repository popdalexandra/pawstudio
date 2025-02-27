
import { getMyOrders } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';

export const metadata = {
    title: `Comenzile mele | ${APP_NAME}`
}

const OrdersPage = async (props: {
    searchParams: Promise<{ page: string }>;
  }) => {
    const { page } = await props.searchParams;
    const orders = await getMyOrders({
        page: Number(page) || 1,
      });

      return (
        <div className='space-y-2'>
          <h2 className='h2-bold'>Comenzile mele</h2>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>DATA</TableHead>
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
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      {order.isPaid && order.paidAt
                        ? formatDateTime(order.paidAt).dateTime
                        : <span className="text-red-500">Neplătită</span>}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered && order.deliveredAt
                        ? formatDateTime(order.deliveredAt).dateTime
                        : <span className="text-red-500">Nelivrată</span>}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className='px-2'>Detalii</span>
                      </Link>
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
 
export default OrdersPage;