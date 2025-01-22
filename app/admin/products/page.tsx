import Link from 'next/link';
import { getAllProducts, deleteProduct } from '@/lib/actions/product.action';
import { formatCurrency, formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/product/delete-dialog';
import { APP_NAME } from '@/lib/constants';


export const metadata = {
    title: `Administrare | ${APP_NAME}`
}


const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Produse</h1>
          {searchText && (
            <div>
             Filtrează după <i>&quot;{searchText}&quot;</i>{' '}
              <Link href='/admin/products'>
                <Button variant='outline' size='sm'>
                  Șterge filtrul
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant='default' className=" hover:bg-pink-700">
          <Link href='/admin/products/create'>Adaugă produs</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NUME</TableHead>
            <TableHead className='text-center'>PREȚ</TableHead>
            <TableHead>CATEGORIE</TableHead>
            <TableHead>CANTITATE</TableHead>
            <TableHead>EVALUARE</TableHead>
            <TableHead className='w-[100px]'>ACȚIUNI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className='text-center'>
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='outline' size='sm'>
                  <Link href={`/admin/products/${product.id}`}>Editează</Link>
                </Button>
                 <DeleteDialog id={product.id} action={deleteProduct} /> 
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProductsPage;