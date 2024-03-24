import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function TitleInput() {
  const { control, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel htmlFor="title">Summarize Your Review (Title)</FormLabel>
          <FormControl>
            <Input placeholder="Will be used as a title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
