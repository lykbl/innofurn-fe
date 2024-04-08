import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/common/input';

const PhoneInput = ({ phoneCode }: { phoneCode: string }) => {
  const { control } = useFormContext();
  const handle = 'contactPhone';

  return (
    <FormField
      control={control}
      name={handle}
      render={({ field }) => (
        <FormItem className={'w-full'}>
          <FormLabel htmlFor={handle}>Contact Phone</FormLabel>
          <FormControl>
            <div className="flex items-center gap-1">
              {/* TODO make this prettier */}
              {/*<span>+{phoneCode}</span>*/}
              <Input {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;
