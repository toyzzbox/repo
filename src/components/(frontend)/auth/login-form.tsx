"use client";

import React, { useState } from 'react'
import CardWrapper from './card-wrapper';
import {   useForm } from 'react-hook-form';
import { LoginSchema } from '../../../schema';
import {z} from "zod";
import {FormError} from "./form-error";
import {FormSuccess} from "./form-success";
import {zodResolver} from "@hookform/resolvers/zod"
import { login } from '../../../actions/login'
import Link from 'next/link';
import GoogleLogin from './google-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';




const LoginForm = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");


 const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
        email: "",
        password: "",
    }
 });

 const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    login(data).then((res) => {
        if (res.error) {
            setLoading(false);
            setError(res.error);
            setSuccess("");
          
        } if (res.success) {
            setLoading(false);
            setError("");
            setSuccess(res.success);
        }
        setLoading(false);
    })
    };
    
    return (
   <CardWrapper 
   headerLabel=''
   title= ""
   backButtonHref='/register'
   backButtonLabel='Henüz bir hesabınız yoksa Üye ol'
   showSocial
  >
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
            <FormField 
            control={form.control}
            name='email'
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input
                         {...field} 
                         placeholder="johndoe@email.com"
                        type='email'
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
                />
           
                 <FormField control={form.control}
            name='password'
            render={({field}) => (
                <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="******"
                        type='password'/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
                />
                <Button size="sm" variant="link" asChild className='px-0 font-normal'>
                    <Link href="/login/reset" >Parolamı unuttum</Link>
                </Button>
             
            </div>
            <FormSuccess message={success}/>
            <FormError message={error}/>
            <Button type="submit" className='w-full' disabled={loading}>
                {loading ? "Loading..." : "Giriş Yap"}
            </Button>
        </form>
    </Form>
    <GoogleLogin/>
  </CardWrapper>
  );
}

export default LoginForm