
import ProductForm from '@/components/admin/product-form';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
    title: `Adaugă | ${APP_NAME}`
}

const CreateProductPage = () => {
  return (
    <>
      
      <div className='my-8'>
        <ProductForm type='Creează' />
      </div>
    </>
  );
};

export default CreateProductPage;