import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { useForm } from 'react-hook-form';
import {
  AddressFragmentFragment,
  AddressFragmentFragmentDoc,
  AddressInput, CheckMeFragmentFragmentDoc,
  CountryFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import AddressLines from '@/components/address/address-form/address-lines';
import TextInput from '@/components/address/address-form/text-input';
import TitleInput from '@/components/address/address-form/title';
import PersonalDetails from '@/components/address/address-form/personal-details';
import { Button } from '@/components/ui/common/button';
import { useFragment } from '@/gql/generated';
import { useMutation, useQuery, useSuspenseQuery } from '@apollo/client';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import CountryInput from '@/components/address/address-form/country-input';
import PhoneInput from '@/components/address/address-form/phone-input';
import { Card, CardContent } from '@/components/ui/common/card';
import {
  ADD_ADDRESS_MUTATION,
  EDIT_ADDRESS_MUTATION,
} from '@/gql/mutations/address';
import { COUNTRIES_QUERY } from '@/gql/queries/country';
import { CheckMeQuery } from '@/gql/queries/user';

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
  countryId: z.coerce.number().positive(),
  deliveryInstructions: z.string().min(1).max(255).optional(),
  contactEmail: z.string().min(1).max(255).optional(),
  contactPhone: z.string().min(1).max(255),
  shippingDefault: z.boolean().optional(),
  billingDefault: z.boolean().optional(),
});

const AddressForm = ({
  address,
  toggleAddressFormView,
  handleAddressChange,
}: {
  address: AddressFragmentFragment | null;
  toggleAddressFormView: () => void;
  handleAddressChange: (address?: AddressFragmentFragment) => void;
}) => {
  const { data: checkMeQuery } = useSuspenseQuery(CheckMeQuery);
  const user = useFragment(CheckMeFragmentFragmentDoc, checkMeQuery?.checkMe);
  const form = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      title: address?.title || '',
      firstName: address?.firstName || user?.customer?.firstName || '',
      lastName: address?.lastName || user?.customer?.lastName || '',
      companyName: address?.companyName || '',
      lineOne: address?.lineOne || '',
      lineTwo: address?.lineTwo || '',
      lineThree: address?.lineThree || '',
      city: address?.city || '',
      state: address?.state || '',
      postcode: address?.postcode || '',
      countryId: address?.country?.id || 156,
      deliveryInstructions: address?.deliveryInstructions || '',
      contactEmail: address?.contactEmail || '',
      contactPhone: address?.contactPhone || '',
      shippingDefault: address?.shippingDefault || false,
      billingDefault: address?.billingDefault || false,
    },
  });
  const [editAddress] = useMutation(EDIT_ADDRESS_MUTATION);
  const [addAddress] = useMutation(ADD_ADDRESS_MUTATION);
  const { data: countriesQuery } = useQuery(COUNTRIES_QUERY);
  const [isPending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const input: AddressInput = {
        id: address?.id || null,
        billingDefault: false,
        shippingDefault: false,
        ...values,
      };

      //TODO make this smarter?
      if (address) {
        const response = await editAddress({ variables: { input } });
        if (!response?.errors) {
          toggleAddressFormView();
        }
      } else {
        const response = await addAddress({
          variables: { input },
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
        if (response.data?.addAddress) {
          handleAddressChange(
            useFragment(AddressFragmentFragmentDoc, response.data?.addAddress),
          );
          toggleAddressFormView();
        }
      }
    }),
  );
  const { countryId } = form.getValues();
  const countries =
    countriesQuery?.countries.map((c) =>
      useFragment(CountryFragmentFragmentDoc, c),
    ) || [];
  const phoneCode =
    countries.find((c) => c.id === countryId)?.phoneCode || '+1';

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn(isPending && 'animate-pulse')}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex w-full flex-col gap-2">
              <div className="flex gap-2">
                <TitleInput />
              </div>
              <PersonalDetails />
              <AddressLines />
              <div className="flex w-1/2 gap-2">
                <TextInput label="City" handle="city" />
                <TextInput label="Postcode" handle="postcode" />
                <CountryInput countries={countries} />
              </div>
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
                  <PhoneInput phoneCode={phoneCode} />
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AddressForm;
