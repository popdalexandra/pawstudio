import {z} from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z
        .string()
        . refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Pretul trebuie sa contina 2 cifre dupa virgula.')

// Schema pentru inserarea de produse
export const insertProductsSchema = z.object({
    name: z.string().min(3, 'Numele trebuie sa fie de cel putin 3 caractere.' ),
    slug: z.string().min(3, 'Slug-ul trebuie sa fie de cel putin 3 caractere.' ),
    category: z.string().min(3, 'Categoria trebuie sa fie de cel putin 3 caractere.' ),
    brand: z.string().min(3, 'Tipul trebuie sa fie de cel putin 3 caractere.' ),
    description: z.string().min(3, 'Descrierea trebuie sa fie de cel putin 3 caractere.' ),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, "Trebuie sa contina cel putin o poza."),
    isFeatured: z.boolean(),
    banner:z.string().nullable(),
    price: currency,

});

//Schema pentru sign in
export const signInFormSchema = z.object({
    email: z.string().email('Email-ul este invalid.'),
    password: z.string().min(6, 'Parrola trebuie sa contina cel putin 6 caractere'),

})