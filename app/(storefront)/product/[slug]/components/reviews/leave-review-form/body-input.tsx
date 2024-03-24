import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function BodyInput() {
  const { control, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="body"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel htmlFor="body">Your Review</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-[120px]"
              placeholder="Pay attention to quality, convenience, compliance with stated specifications, etc."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
