import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import FiveStars from '@/components/ui/common/five-stars';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function RatingInput() {
  const { control, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="rating"
      render={({ field }) => (
        <FormItem className="">
          <FormLabel htmlFor="rating">Rating</FormLabel>
          <FormControl>
            <FiveStars
              className="h-10"
              rating={field.value}
              handleClick={field.onChange}
              withEmojis={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
