import {z} from 'zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS } from './constants';

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

// Schema for updating products
export const updateProductSchema = insertProductsSchema.extend({
  id: z.string().min(1, 'Id este necesar'),
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

//Schema pentru shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Vă rugăm să completați câmpul cu numele dumneavoastră. Acest câmp nu poate fi lăsat gol.'),
    phoneNumber:  z.string().min(10, 'Vă rugăm să completați câmpul cu numărul de telefon. Acest câmp nu poate fi lăsat gol.'),
    streetAddress: z.string().min(3, 'Vă rugăm să completați câmpul cu adresa dumneavoastră. Acest câmp nu poate fi lăsat gol.'),
    city: z.string().min(3, 'Vă rugăm să completați câmpul cu orașul și județul dumneavoastră. Acest câmp nu poate fi lăsat gol.'), 
    postalCode: z.string().min(3, 'Vă rugăm să completați câmpul cu codul poștal. Acest câmp nu poate fi lăsat gol.'),
    country: z.string().min(3, 'Vă rugăm să completați câmpul cu țara dumneavoastră. Acest câmp nu poate fi lăsat gol.'), 
    lat: z.number().optional(),
    lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Vă rugăm să selectați o metodă de plată. Acest pas este obligatoriu.'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Metodă de plată invalidă.',
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'Utilizatorul este obligatoriu.'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
      message: 'Metoda de plată este invalidă.',
    }),
    shippingAddress: shippingAddressSchema,
  });
  
  // Schema for inserting an order item
  export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
  });

  // Schema for the PayPal paymentResult
  export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//Update user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Numele trebuie sa fie de cel putin 3 caractere.'),
  email: z.string().email('Email-ul este invalid.'),
});