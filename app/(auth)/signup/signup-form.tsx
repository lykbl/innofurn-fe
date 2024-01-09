'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Input } from "@/components/ui/common/input";
import { Button } from "@/components/ui/common/button";
import { gql } from "@/gql";
import { useMutation } from "@apollo/client";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const SIGNUP_MUTATION = gql(/* GraphQL */`
    mutation SignUp ($input: SignUpInput!) {
        signUp (input: $input) {
            id
        }
    }
`);

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    // mode: 'onChange',
  })
  const [mutateAsync, { error, data }] = useMutation(SIGNUP_MUTATION);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutateAsync({
      variables: {
        email: values.email,
        password: values.password,
      },
    });

    console.log('signed up', response)
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
                  placeholder="Password goes here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign Up with Email
        </Button>
      </form>
    </Form>
  )
}
