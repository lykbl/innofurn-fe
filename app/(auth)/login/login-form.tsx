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
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email(),
})
const LOGIN_MUTATION = gql(/* GraphQL */`
    mutation LoginTest ($input: LoginInput!) {
        login(input: $input) {
            id
        }
    }
`);

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  })
  const [mutateAsync, { loading }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutateAsync({
      variables: {
        input: {
          email: values.email,
        }
      },
    });

    if (response.errors) {
      toast({
        duration: 5000,
        type: 'foreground',
        title: 'Error',
        description: response.errors[0].message,
        variant: 'destructive',
      });
    }
    if (response.data) {
      router.push('/');
    }
  }

  return (
    <Form
      {...form}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login with Email
        </Button>
      </form>
    </Form>
  )
}
