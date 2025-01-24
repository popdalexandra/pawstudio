
import { Button } from './ui/button';
import Link from 'next/link';

const ViewAllProductsButton = () => {
  return (
    <div className='flex justify-center items-center my-8 '>
      <Button asChild className='px-8 py-4 text-lg font-semibold hover:bg-pink-700'>
        <Link href='/search'>Vezi toate produsele</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
