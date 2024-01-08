'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/common/form";
import { Input } from "@/components/ui/common/input";
import { Button } from "@/components/ui/common/button";
import Link from "@/ui/common/link";
import ROUTES from "@/lib/routes";
import { CheckboxWithText } from "@/(storefront)/login/page";
import { FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa";
import { ReactElement } from "react";
import BaseLink from "next/link";
import { useMutation } from '@tanstack/react-query'
import { gql } from "@/gql";
import { request } from "graphql-request";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
})

const LOGIN_MUTATION = gql(/* GraphQL */`
    mutation LoginTest ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
        }
    }
`);

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  })
  const { data, mutateAsync, error, isError } = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: any) => request(
      process.env.GRAPHQL_ENDPOINT || 'http://localhost/graphql',
      LOGIN_MUTATION,
      {
        email,
        password,
      },
    ),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutateAsync({
      email: values.email, password: values.password,
    });
  }

  const onError = (errors: any) => {
    console.log(errors)
  }

  return (
    <Form
      {...form}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder="your-cool@mail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder="Password goes here..." {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <CheckboxWithText
          id='rememberMe'
          label='Remember me'
        />
        <p className='text-sm'>
          Not a member yet? <Link href={ROUTES.SIGN_UP}>Sign up here</Link>
        </p>
      </form>
    </Form>
  )
}

export const OAuthButtons = () => {
  const size = 36;
  const types = [
    {
      icon: <FaGithub size={size} />,
      type: 'github',
    },
    {
      icon: <FaGoogle size={size} />,
      type: 'google',
    },
    {
      'icon': <FaLinkedin size={size} />,
      'type': 'linkedin',
    },
  ];

  return (
    types.map((config: { icon: ReactElement, type: string }, i: number) => (
      <BaseLink
        className='text-primary hover:text-primary/90'
        key={i}
        // href={`${ROUTES.OAUTH_REDIRECT}/${config.type}`}
        href={`http://localhost${ROUTES.OAUTH_REDIRECT}/${config.type}`}
      >
        {config.icon}
      </BaseLink>
    ))
  );
}
