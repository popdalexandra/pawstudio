import { APP_NAME } from "@/lib/constants";
import { getAllUsers, deleteUser } from '@/lib/actions/user.action';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from "@/components/shared/product/delete-dialog";


export const metadata = {
    title: `Utilizatori | ${APP_NAME}`
}

const AdminUserPage = async (props: {
    searchParams: Promise<{
      page: string;
      query: string;
    }>;
  }) => {
    const { page = '1', query: searchText } = await props.searchParams;
  
    const users = await getAllUsers({ page: Number(page), query: searchText });
  
    return (
      <div className='space-y-2'>
        <div className="flex items-center gap-8">
          <h1 className="h2-bold">Utilizatori</h1>
          {searchText && (
            <div className="flex items-center gap-3">
              Filtrat după <i>&quot;{searchText}&quot;</i>{' '}
              <Link href="/admin/users">
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
                <TableHead>NUME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>ROL</TableHead>
                <TableHead>ACȚIUNI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{formatId(user.id)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'utilizator' ? (
                      <Badge variant='secondary'>Utilizator</Badge>
                    ) : (
                      <Badge className="bg-pink-200 text-black hover:bg-pink-200">Admin</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/admin/users/${user.id}`}>Editează</Link>
                    </Button>
                    <DeleteDialog id={user.id} action={deleteUser} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.totalPages > 1 && (
            <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
          )}
        </div>
      </div>
    );
  };
  
  export default AdminUserPage;