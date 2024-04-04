import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/common/input';
import { Button } from '@/components/ui/common/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckMeFragmentFragment } from '@/gql/generated/graphql';
import { gql } from '@/gql/generated';
import { useMutation } from '@apollo/client';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const AVAILABLE_TITLES = ['Mr', 'Mrs', 'Ms', 'Mx', 'Ind'];

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  title: z.string().min(2),
});

const UpdateDetailsMutation = gql(/* GraphQL */ `
  mutation UpdateDetails($input: UpdateDetailsInput!) {
    updateDetails(input: $input) {
      customer {
        firstName
        lastName
        title
      }
    }
  }
`);

export default function UpdateDetailsForm({
  user,
}: {
  user: CheckMeFragmentFragment;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.customer.firstName,
      lastName: user.customer.lastName,
      title: user.customer.title,
    },
    mode: 'onSubmit',
  });
  const [updateProfileDetails, { loading }] = useMutation(
    UpdateDetailsMutation,
  );
  const handleSubmit = form.handleSubmit(async (data) => {
    const response = await updateProfileDetails({
      variables: {
        input: {
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
        },
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
        description: 'Details successfully updated.',
        variant: 'default',
      });

      form.reset({
        firstName: response.data.updateDetails.customer.firstName,
        lastName: response.data.updateDetails.customer.lastName,
        title: response.data.updateDetails.customer.title,
      });
    }
  });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-2', loading && 'animate-pulse')}
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2">
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={user.customer.title}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent defaultValue={user.customer.title}>
                    {AVAILABLE_TITLES.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading || !form.formState.isDirty}>
          Update Details
        </Button>
      </form>
    </Form>
  );
}
