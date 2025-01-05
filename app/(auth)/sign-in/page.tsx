import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
    title: `Autentificare | ${APP_NAME}`
}

const SignInPage = async(props: {
    searchParams: Promise<{callbackUrl: string}>
}) => {

    const {callbackUrl} = await props.searchParams;
    const session = await auth();
    if(session){
        return redirect(callbackUrl || '/');
    }

    return <div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-4">
                <Link href='/' className='flex-center'>
                    <Image src='/images/logo_nou.png' width={100} height={100} alt={`${APP_NAME} logo`}  priority={true}/>
                </Link>
                <CardTitle className="text-center">Autentificare</CardTitle>
                <CardDescription className="text-center">Bine ai revenit! Te rugăm să te autentifici pentru a continua.</CardDescription>
                <CardContent className="space-y-4">
                    <CredentialsSignInForm/>
                </CardContent>
            </CardHeader>
        </Card>
    </div>
}
 
export default SignInPage;