import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import {prisma} from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export const config = {
    pages:{
        signIn:'/sign-in',
        error:'/sign-in'
    },
    session:{
        strategy: 'jwt',
        maxAge:30 * 24 * 60 * 60, // sesiunea dureaza 30 de zile
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider(
            {
                credentials:{
                    email: {type: 'email'},
                    password: {type: 'password'}
                },
                async authorize(credentials){
                    if(credentials == null) return null;

                    //Gasim user in database
                    const user = await prisma.user.findFirst({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    // Verificam daca userul exista si daca parola se potriveste
                    if (user && user.password){
                        const isMatch = compareSync(credentials.password as string, user.password);
                        
                        // Parola corecta
                        if(isMatch){
                            return{
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role
                            };
                        }

                    }

                    // daca user ul nu exista sau parola nu se potriveste
                    return null;

                },
            }
        ),
    ],
    callbacks: {
        async session({session, user, trigger, token}:any){
        //setam used id din token
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;

        //in caz de update
        if(trigger === 'update'){
            session.user.name = user.name;
        }

        return session},

        async jwt ({token, user, trigger, session}: any) {
            if(user) {
                token.role = user.role;

            if(user.name === 'NO_NAME')
            {
                token.name = user.email!.split('@')[0];
                await prisma.user.update({
                    where: {id: user.id},
                    data:{name: token.name}
                })
            }
            }
            return token;
        },

        authorized({request, auth}: any) {
            //Check for session cart cookie
            if(!request.cookies.get('sessionCartId')){
                //Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();
                // Clone reqest headers
                const newRequestHeaders = new Headers(request.headers);
                // Create new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });
                //Set newly generated sessionCartId in the response cookie
                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            }
            else{
                return true;
            }
        }
    },

}satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config);