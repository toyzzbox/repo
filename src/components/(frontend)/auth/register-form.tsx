"use client";

import React, { useState } from 'react'
import CardWrapper from './card-wrapper';
import {   useForm } from 'react-hook-form';
import { RegisterSchema } from '../../../schema';
import {z} from "zod";
import {FormError} from "./form-error";
import {FormSuccess} from "./form-success";
import {zodResolver} from "@hookform/resolvers/zod"
import { register } from '@/actions/register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';



const RegisterForm = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");


 const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
        email: "",
        name: "",
        password: "",
        passwordConfirmation:"",
    }
 });

 const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    register(data).then((res) => {
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
   headerLabel='Kayıt Ol ve Fırsatlardan Yararlanmaya Şimdi Başla !'
   title=""
   backButtonHref='/login'
   backButtonLabel='Hesabınız var ise giriş yapmak için'
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
                         placeholder=""
                        type='email'
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
                />
                 <FormField 
            control={form.control}
            name='name'
            render={({field}) => (
                <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                        <Input
                         {...field} 
                         placeholder=""
                        type="text"
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
               <FormField control={form.control}
            name='passwordConfirmation'
            render={({field}) => (
                <FormItem>
                    <FormLabel>Şifreyi Doğrula</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="******"
                        type='password'/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
                />
                
            </div>
            <FormSuccess message={success}/>
            <FormError message={error}/>
            <Button type="submit" className='w-full' disabled={loading} variant="secondary">
                {loading ? "Loading..." : "Kayıt Ol"}
            </Button>
            
        </form>
    </Form>
  </CardWrapper>
  );
}

export default RegisterForm