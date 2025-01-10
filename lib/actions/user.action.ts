'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma"
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";

// Autentificare
export async function signInWithCredentials(prevState: unknown,
    formData: FormData) {
    try {
    const user = signInFormSchema.parse({
        email: formData.get('email'),
        password: formData.get('password')
    });

    await signIn('credentials', user);

    return{ success: true, message: 'Autentificare realizată cu succes.'}
}
    catch (error) {
            if(isRedirectError(error)){
            throw error;
        }

        return{ success: false, message: 'Email-ul sau parola introduse nu sunt corecte.'}
    }
}


// Deconectare
export async function signOutUser() {
    await signOut();
}

    
// Inregistrare
export async function signUpUser(prevState: unknown, formData:FormData){
    try{
        const user = signUpFormSchema.parse(
            {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
            }
        );
        const plainPassword = user.password;

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email:user.email,
                password: user.password,
            },
        });

        await signIn('credentials', {
            email: user.email, 
            password: plainPassword,}
        );

        return {success: true, message: "Inregistrare realizata cu succes."};

    } catch(error) {
        if(isRedirectError(error)){
            throw error;
        }

        return{ success: false, message: formatError(error)};
    }
}


export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId },
});
if (!user) throw new Error('Utilizatorul nu a fost găsit! '); 
return user;
}

// Actualizare in database cu adresa utilizatorului

export async function updateUserAddress(data: ShippingAddress) { 
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id}
        });

        if (!currentUser) throw new Error('Utilizatorul nu a fost gasit.');
        
        const address = shippingAddressSchema.parse(data);
        await prisma.user.update({
        where: { id: currentUser.id },
        data: {address}
        });

        return{
            success: true,
            message: 'Adresa utilizatorului a fost adaugata cu succes.'
        }

        } catch (error) {
        return { success: false, message: formatError(error) }
        }
    }

    // Actualizare in database metoda de plata
export async function updateUserPaymentMethod(
    data: z.infer<typeof paymentMethodSchema>
  ) {
    try {
      const session = await auth();
      const currentUser = await prisma.user.findFirst({
        where: { id: session?.user?.id },
      });
  
      if (!currentUser) throw new Error('Utilizatorul nu a fost găsit.');
  
      const paymentMethod = paymentMethodSchema.parse(data);
  
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { paymentMethod: paymentMethod.type },
      });
  
      return {
        success: true,
        message: 'Metoda de plata a fost actualizata cu succes.',
      };
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }