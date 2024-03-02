import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { useForm } from 'react-hook-form';
import { AddressFragmentFragment } from '@/gql/generated/graphql';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import AddressLines from '@/(storefront)/checkout/components/address-form/address-lines';
import TextInput from '@/(storefront)/checkout/components/address-form/text-input';
import TitleInput from '@/(storefront)/checkout/components/address-form/title';
import PersonalDetails from '@/(storefront)/checkout/components/address-form/personal-details';
import { Button } from '@/components/ui/common/button';
import { gql } from '@/gql/generated';
import { useMutation } from '@apollo/client';

export const AddressFormSchema = z.object({
  title: z.string().min(1).max(255),
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  companyName: z.string().max(255).optional(),
  lineOne: z.string().max(255),
  lineTwo: z.string().max(255).optional(),
  lineThree: z.string().max(255).optional(),
  city: z.string().min(1).max(255),
  state: z.string().max(2).optional(),
  postcode: z.string().min(1).max(20),
  countryId: z.number().positive().optional(),
  deliveryInstructions: z.string().min(1).max(255).optional(),
  contactEmail: z.string().min(1).max(255).optional(),
  contactPhone: z.string().min(1).max(255),
  shippingDefault: z.boolean().optional(),
  billingDefault: z.boolean().optional(),
});

const UPDATE_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation updateAddress($input: AddressInput!) {
    editAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

const ADD_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation addAddress($input: AddressInput!) {
    addAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

const AddressForm = ({
  address,
  toggleAddressFormView,
}: {
  address: AddressFragmentFragment | null;
  toggleAddressFormView: () => void;
}) => {
  const form = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      title: address?.title || 'T',
      firstName: address?.firstName || 'T',
      lastName: address?.lastName || 'T',
      companyName: address?.companyName || 'T',
      lineOne: address?.lineOne || 'T',
      lineTwo: address?.lineTwo || 'T',
      lineThree: address?.lineThree || 'T',
      city: address?.city || 'T',
      state: address?.state || 'T',
      postcode: address?.postcode || 'T',
      countryId: address?.country?.id || 1,
      deliveryInstructions: address?.deliveryInstructions || 'T',
      contactEmail: address?.contactEmail || 'test@mail.com',
      contactPhone: address?.contactPhone || '+375291020412',
      shippingDefault: address?.shippingDefault || false,
      billingDefault: address?.billingDefault || false,
    },
  });
  const [updateAddress] = useMutation(UPDATE_ADDRESS_MUTATION);
  const [addAddress] = useMutation(ADD_ADDRESS_MUTATION);

  const onSubmit = form.handleSubmit(async (values) => {
    if (address) {
      const response = await updateAddress({
        variables: {
          input: {
            id: address.id,
            countryId: 1,
            billingDefault: false,
            shippingDefault: false,
            ...values,
          },
        },
      });
      if (!response.errors) {
        toggleAddressFormView();
      }
    } else {
      const response = await addAddress({
        variables: {
          input: {
            ...values,
            countryId: 1,
            billingDefault: false,
            shippingDefault: false,
          },
        },
        updateQueries: {
          addresses: (prev, { mutationResult }) => {
            if (mutationResult.errors || !mutationResult.data?.addAddress) {
              return prev;
            }

            return {
              addresses: [...prev.addresses, mutationResult.data.addAddress],
            };
          },
        },
      });
      if (!response.errors) {
        toggleAddressFormView();
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex w-full flex-col gap-2">
          <div className="flex gap-2">
            <TitleInput />
          </div>
          <PersonalDetails />
          <AddressLines />
          <div className="flex w-1/2 gap-2">
            <TextInput label="City" handle="city" />
            <TextInput label="Postcode" handle="postcode" />
          </div>
          {/*<TextInput label="Country Id" handle="countryId" />*/}
          <div className="flex gap-2">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="deliveryInstructions"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="deliveryInstructions">
                      Delivery Instructions
                    </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-1/2 flex-col gap-2">
              <TextInput label="Contact Email" handle="contactEmail" />
              <TextInput label="Contact Phone" handle="contactPhone" />
            </div>
          </div>
          {/*<TextInput label="Shipping Default" handle="shippingDefault" />*/}
          {/*<TextInput label="Billing Default" handle="billingDefault" />*/}
          <div className="flex w-1/3 gap-2">
            <Button type="submit" className="w-full">
              Save
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleAddressFormView}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
