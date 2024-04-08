import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import { Button } from '@/components/ui/common/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckMeFragmentFragment } from '@/gql/generated/graphql';
import { useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { UpdateEmailMutation } from '@/gql/mutations/user';

const emailSchema = z.object({
  email: z.string().email(),
});

export default function UpdateEmailForm({
  user,
}: {
  user: CheckMeFragmentFragment;
}) {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user.email,
    },
    mode: 'onSubmit',
  });
  const { toast } = useToast();
  const [updateEmail, { loading }] = useMutation(UpdateEmailMutation);
  const handleSubmit = form.handleSubmit(async (data) => {
    const response = await updateEmail({
      variables: {
        email: data.email,
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
      toast({
        duration: 5000,
        type: 'foreground',
        title: 'Success',
        description:
          'Email successfully updated. Please check your email for verification link.',
        variant: 'default',
      });

      form.reset({
        email: response.data.updateEmail.email,
      });
    }
  });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-2', loading && 'animate-pulse')}
        onSubmit={handleSubmit}
      >
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              {user.emailVerifiedAt === null && (
                <p className="text-xs text-secondary">Email not verified</p>
              )}
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading || !form.formState.isDirty} type="submit">
          Update Email
        </Button>
      </form>
    </Form>
  );
}
