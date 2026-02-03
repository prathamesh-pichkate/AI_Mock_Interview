'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/dist/client/link';
import FormField from './FormField';
import { useRouter } from 'next/dist/client/components/navigation';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  // 1. Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler
  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        console.log('Signing up user:', data);
        toast.success('Account created successfully!');
        router.push('/sign-in');
      } else {
        console.log('Signing in user:', data);
        toast.success('Signed in successfully!');
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">AI-Interview</h2>
        </div>
        <h3>Practice your interview skills with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!type.includes('sign-in') && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {type === 'sign-in' ? 'Sign In' : 'Create an Account'}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {type === 'sign-in'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <Link
            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
            className="font-bold text-user-primary ml-1"
          >
            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
