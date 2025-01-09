'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.action";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";


const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
      success: false,
      message: ' ',
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignUpButton = () => {
        const {pending} = useFormStatus();
        return (
            <Button disabled={pending} className="w-full hover:bg-pink-700" variant='default'>
                {pending ? '...' : 'Sa incepem'}
            </Button>
        )

};
    return <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
        <div>
                <Label htmlFor='name'>Email</Label>
                <Input 
                        id = 'name'
                        name = 'name'
                        type = 'text'
                        required
                        autoComplete="name"
                        defaultValue={signUpDefaultValues.name}/>
            </div>
            <div>
                <Label htmlFor='email'>Email</Label>
                <Input 
                        id = 'email'
                        name = 'email'
                        type = 'email'
                        required
                        autoComplete="email"
                        defaultValue={signUpDefaultValues.email}/>
            </div>
            <div>
                <Label htmlFor='password'>Parola</Label>
                <Input 
                        id = 'password'
                        name = 'password'
                        type = 'password'
                        required
                        autoComplete="password"
                        defaultValue={signUpDefaultValues.password}/>
            </div>
            <div>
                <Label htmlFor='confirmPassword'>Confirma Parola</Label>
                <Input 
                        id = 'confirmPassword'
                        name = 'confirmPassword'
                        type = 'password'
                        required
                        autoComplete="confirmPassword"
                        defaultValue={signUpDefaultValues.confirmPassword}/>
            </div>
            <div>
                <SignUpButton></SignUpButton>
            </div>
            {data && !data.success && (
                <div className="text-center text-destructive">{data.message}</div>
            )}
            <div className="text-sm text-center text-muted-foreground">
            Ai un cont existent? {' '}
            <Link href='/sign-in' target='_self' className='link'> Autentifica-te aici.</Link>
            </div>
        </div>
    </form>

}
 
export default SignUpForm;