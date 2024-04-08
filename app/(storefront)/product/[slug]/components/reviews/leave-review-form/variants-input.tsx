import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductReviewVariantFragmentFragment } from '@/gql/generated/graphql';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { useFormContext } from 'react-hook-form';

export default function VariantsInput({
  variants,
}: {
  variants: Array<ProductReviewVariantFragmentFragment>;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="productVariantId"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="productVariantId">Variant</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value.toString()} //TODO annoying?
          >
            <FormControl>
              <SelectTrigger disabled={variants.length === 1} className="w-[180px]">
                <SelectValue placeholder="Variant" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {variants.map(({ id, name }) => (
                <SelectItem key={id} value={id.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
