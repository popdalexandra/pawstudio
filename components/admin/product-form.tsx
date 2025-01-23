'use client';

import { useToast } from '@/hooks/use-toast';
import { productDefaultValues } from '@/lib/constants';
import { insertProductsSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product.action';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
 
const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Creează' | 'Actualizează';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertProductsSchema>>({
    resolver:
      type === 'Actualizează'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductsSchema),
    defaultValues:
      product && type === 'Actualizează' ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductsSchema>> = async (
    values
  ) => {
    // On Create
    if (type === 'Creează') {
      const res = await createProduct(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }

    // On Update
    if (type === 'Actualizează') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'name'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Nume</FormLabel>
                <FormControl>
                  <Input placeholder='Introduceți numele produsului' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'slug'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Introduceți slug-ul' {...field} />
                    <Button
                      type='button'
                      className='bg-pink-200 hover:bg-pink-400 text-black px-4 py-1 mt-2 border border-pink-600'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        );
                      }}
                    >
                      Generează
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'category'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Categorie</FormLabel>
                <FormControl>
                  <Input placeholder='Introduceți categoria' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name='brand'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'brand'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Marcă</FormLabel>
                <FormControl>
                  <Input placeholder='Introduceți marca' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          <FormField
            control={form.control}
            name='price'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'price'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Preț</FormLabel>
                <FormControl>
                  <Input placeholder='Introduceți prețul' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'stock'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stoc</FormLabel>
                <FormControl>
                  <Input placeholder='Introduceți numărul de bucăți de pe stoc.' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Imagini</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
          Produs vedetă
          <Card>
            <CardContent className='space-y-2 mt-2'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='space-x-2 items-center'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Este un produs vedetă</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='banner image'
                  className='w-full object-cover object-center rounded-sm'
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductsSchema>,
                'description'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Descriere</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Introduceți descrierea produsului'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full hover:bg-pink-700'
          >
            {form.formState.isSubmitting ? '...' : `${type} produsul`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;