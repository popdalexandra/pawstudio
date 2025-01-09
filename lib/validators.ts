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

//Schema pentru autentificare
export const signInFormSchema = z.object({
    email: z.string().email('Email-ul este invalid.'),
    password: z.string().min(6, 'Parrola trebuie sa contina cel putin 6 caractere'),

})

//Schema pentru inregistrare
export const signUpFormSchema = z.object({
    name:z.string().min(3, 'Numele trebuie sa fie de cel putin 3 caractere.'),
    email: z.string().email('Email-ul este invalid.'),
    password: z.string().min(6, 'Parola trebuie sa contina cel putin 6 caractere'),
    confirmPassword: z.string().min(6, 'Confirmarea parolei trebuie sa contina cel putin 6 caractere'),

}).refine((data)=> data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ['confirmPassword'],
});

//Schema cos de cumparaturi
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Produsul este necesar.'),
    name: z.string().min(1, 'Numele este necesar.'),
    slug: z.string().min(1, 'Slug-ul este necesar.'),
    qty: z.number().int().nonnegative('Cantitatea nu poate fi negativa.'),
    image: z.string().min(1, 'Imaginea este necesara.'),
    price: currency,

});

export const insertCartSchema = z.object({
    items:z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice:currency,
    sessionCartId: z.string().min(1, ' Session cart id este necesar.'),
    userId: z.string().optional().nullable(),
});
