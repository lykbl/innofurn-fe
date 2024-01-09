'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Input } from "@/components/ui/common/input";
import { Button } from "@/components/ui/common/button";
import { useMutation } from "@apollo/client";
import { gql } from "@/gql";
import { useRouter } from "next/navigation";

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
    },
    // mode: 'onChange',
  })
  const [mutateAsync, { error, data }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutateAsync({
      variables: {
        email: values.email, password: values.password,
      },
    });

    router.push('/test');
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
              <FormControl>
                <Input
                  type='email'
                  placeholder="example@mail.com"
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
        <Button type="submit" className="w-full">Login with Email</Button>
      </form>
    </Form>
  )
}
