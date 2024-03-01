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

export const formSchema = z.object({
  title: z.string().min(1).max(255),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  companyName: z.string().min(1).max(255),
  lineOne: z.string().min(1).max(255),
  lineTwo: z.string().min(1).max(255),
  lineThree: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  state: z.string().min(1).max(255),
  postcode: z.string().min(1).max(20),
  countryId: z.number().positive(),
  deliveryInstructions: z.string().min(1).max(255),
  contactEmail: z.string().min(1).max(255),
  contactPhone: z.string().min(1).max(255),
  shippingDefault: z.boolean(),
  billingDefault: z.boolean(),
});

const AddressForm = ({ address }: { address: AddressFragmentFragment }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: address?.title || '',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      companyName: address?.companyName || '',
      lineOne: address?.lineOne || '',
      lineTwo: address?.lineTwo || '',
      lineThree: address?.lineThree || '',
      city: address?.city || '',
      state: address?.state || '',
      postcode: address?.postcode || '',
      countryId: address?.country?.id || 1,
      deliveryInstructions: address?.deliveryInstructions || '',
      contactEmail: address.contactEmail || '',
      contactPhone: address.contactPhone || '',
      shippingDefault: address.shippingDefault || false,
      billingDefault: address.billingDefault || false,
    },
  });

  return (
    <Form {...form}>
      <form>
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
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
