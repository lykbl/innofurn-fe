import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CountryFragmentFragment } from '@/gql/generated/graphql';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { useFormContext } from 'react-hook-form';

const CountryInput = ({
  countries,
}: {
  countries: Array<CountryFragmentFragment>;
}) => {
  const { control, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="countryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="country">Country</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value.toString()} //TODO annoying?
          >
            <FormControl>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {countries.map(({ id, name }) => (
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
};

export default CountryInput;
