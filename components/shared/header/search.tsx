import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllCategories } from '@/lib/actions/product.action';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action='/search' method='GET'>
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Select name='category'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Toate produsele' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key='All' value='all'>
              Toate produsele
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category} >
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name='q'
          type='text'
          placeholder='Caută...'
          className='md:w-[100px] lg:w-[300px]'
        />
        <Button className='hover:bg-pink-700'>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;