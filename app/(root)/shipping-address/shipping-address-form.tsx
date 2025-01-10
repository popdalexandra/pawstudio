'use client';

import { useRouter } from 'next/navigation'; 
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import {zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form"
import {z} from 'zod';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.action';

const ShippingAddressForm = ({address}: {address: ShippingAddress}) => {
    const router = useRouter();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof shippingAddressSchema>>({ 
        resolver: zodResolver (shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues
    });

    const [isPending, startTransition]= useTransition();

    const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
        startTransition(async()=>{
            const res = await updateUserAddress(values);
            if(!res.success){
                toast({
                    variant:'destructive',
                    description:res.message
                });

                return;
            }

            router.push('/payment-method');

        })
    };
    

    return ( <>
                
        <div className='max-w-md mx-auto space-y-4'>
            <h1 className='h2-bold mt-4'>Formular de livrare</h1> <p className="text-sm text-muted-foreground">
        Vă rugăm să introduceți adresa de livrare.
        </p>
        <Form {...form}>  
            <form method='post' className='space-y-4' onSubmit={form.handleSubmit (onSubmit)}>
                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'fullName'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Nume complet</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți numele complet." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'phoneNumber'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Număr de telefon</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți numărul de telefon." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='streetAddress'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'streetAddress'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Adresa de livrare</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți adresa de livrare." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='city'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'city'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Orasul și județul</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți orașul și județul." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='postalCode'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'postalCode'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Cod poștal</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți codul poștal." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                <FormField
                    control={form.control}
                    name='country'
                    render={({ field, } : {field: ControllerRenderProps <z.infer<typeof shippingAddressSchema>, 'country'>;}) => 
                    ( <FormItem className='w-full'>
                        <FormLabel>Țara</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduceți țara." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )} />
                </div>
                
                
                <div className='flex gap-2'>
                    <Button className="hover:bg-pink-700" type='submit' disabled={isPending}> {isPending? (
                    <Loader className='w-4 h-4 animate-spin' />
                    ): (
                    <ArrowRight className='w-4 h-4' />
                    )}{' '}
                    Continuă
                    </Button>
                </div>

            </form>
        </Form>
        </div>
        
    </> );
};
 
export default ShippingAddressForm;