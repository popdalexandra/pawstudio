import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import {redirect} from 'next/navigation';
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
    title: `Inregistrare | ${APP_NAME}`
}

const SignUpPage = async(props: {
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
                <CardTitle className="text-center">Inregistrare</CardTitle>
                <CardDescription className="text-center">Ne bucuram sa te vedem aici! Te rugăm să te inregistrezi pentru a continua.</CardDescription>
                <CardContent className="space-y-4">
                    <SignUpForm/>
                </CardContent>
            </CardHeader>
        </Card>
    </div>
}
 
export default SignUpPage;