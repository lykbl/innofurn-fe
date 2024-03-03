import { z } from 'zod';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import { AddressFormSchema } from '@/(storefront)/checkout/components/address-form/form';
import { cn } from '@/lib/utils';

type TextInputFields = Omit<
  z.infer<typeof AddressFormSchema>,
  'billingDefault' | 'shippingDefault'
>;
const TextInput = ({
  label,
  handle,
  className,
}: {
  label: string;
  handle: keyof TextInputFields;
  className?: string;
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={handle}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel htmlFor={handle}>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
