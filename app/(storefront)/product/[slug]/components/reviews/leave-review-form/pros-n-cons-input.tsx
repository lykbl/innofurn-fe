import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import React from 'react';

export default function ProsNConsInput() {
  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-1 text-xs">
        <p className="font-semibold">Advantages and Disadvantages</p>
        <p>
          Write down the main advantages and disadvantages of the product - this
          will help other buyers make a choice
        </p>
      </div>
      <FormField
        name="pros"
        render={({ field }) => (
          <FormItem className="w-full space-y-0.5">
            <FormLabel className="text-xs text-green-500">
              Advantages ({field.value?.toString().split(' ').length} / 20
              words)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="What you liked about the product"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="cons"
        render={({ field }) => (
          <FormItem className="w-full space-y-0.5">
            <FormLabel className="text-xs text-red-500">
              Disadvantages (0 / 20 words)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="What you didn't like about the product"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
