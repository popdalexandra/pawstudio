import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { BanknoteIcon, Barcode, CreditCard, Users } from 'lucide-react';
import Link from 'next/link';
import Charts from './charts';

export const metadata = {
    title: `Rapoarte | ${APP_NAME}`
}
const AdminOverviewPage = async () => {
    const session = await auth();
  
    if (session?.user?.role !== 'admin') {
      throw new Error('Utilizatorul nu este autorizat.');
    }
  
    const summary = await getOrderSummary();


    return (
        <div className='space-y-2'>
          <h1 className='h2-bold'>Statistici</h1>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Venit total</CardTitle>
                <BanknoteIcon />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(
                    summary.totalSales._sum.totalPrice?.toString() || 0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Vânzări</CardTitle>
                <CreditCard />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatNumber(summary.ordersCount)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Clienți</CardTitle>
                <Users />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatNumber(summary.usersCount)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Produse</CardTitle>
                <Barcode />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatNumber(summary.productsCount)}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Analiza vânzărilor</CardTitle>
          </CardHeader>
          <CardContent>
           <Charts
              data={{
                salesData: summary.salesData,
              }}
            /> 
           
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Vânzări recente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NUME</TableHead>
                  <TableHead>DATA</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>DETALII</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : 'Deleted User'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className='px-2'>Detalii</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;