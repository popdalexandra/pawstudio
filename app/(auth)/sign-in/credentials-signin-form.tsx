'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";


const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message:'',
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignInButton = () => {
        const {pending} = useFormStatus();
        return (
            <Button disabled={pending} className="w-full" variant='default'>
                {pending ? '...' : 'Sa incepem'}
            </Button>
        )

};
    return <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
            <div>
                <Label htmlFor='email'>Email</Label>
                <Input 
                        id = 'email'
                        name = 'email'
                        type = 'email'
                        required
                        autoComplete="email"
                        defaultValue={signInDefaultValues.email}/>
            </div>
            <div>
                <Label htmlFor='password'>Parola</Label>
                <Input 
                        id = 'password'
                        name = 'password'
                        type = 'password'
                        required
                        autoComplete="password"
                        defaultValue={signInDefaultValues.password}/>
            </div>
            <div>
                <SignInButton></SignInButton>
            </div>
            {data && !data.success && (
                <div className="text-center text-destructive">{data.message}</div>
            )}
            <div className="text-sm text-center text-muted-foreground">
            Nu ai cont? {' '}
            <Link href='/sign-up' target='_self' className='link'> Înregistrează-te aici.</Link>
            </div>
        </div>
    </form>

}
 
export default CredentialsSignInForm;