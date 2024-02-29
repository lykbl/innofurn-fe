import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { useDebounce } from 'react-use';
import { Input } from '@/components/ui/common/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';

export const QuantityInput = ({
  quantity,
  updateQuantity,
}: {
  quantity: number;
  updateQuantity: (newQuantity: number) => void;
}) => {
  const [isCustomQuantityMode, setIsCustomQuantityMode] = useState(false);
  const customQuantityRef = useCallback((quantityInput: HTMLInputElement) => {
    quantityInput?.focus();
  }, []);
  const [customQuantity, setCustomQuantity] = useState(0);

  useDebounce(
    () => {
      if (customQuantity !== quantity) {
        updateQuantity(customQuantity);
        setIsCustomQuantityMode(false);
      }
    },
    300,
    [customQuantity],
  );

  const handleFixedQuantityChange = (newQuantity: number) => {
    updateQuantity(newQuantity);
  };

  const handleCustomQuantityChange: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity !== quantity) {
      setCustomQuantity(newQuantity);
    }
  };

  const enableCustomQuantityMode = () => {
    setIsCustomQuantityMode(true);
  };

  if (isCustomQuantityMode) {
    return (
      <Input
        ref={customQuantityRef}
        type="number"
        className="w-16 rounded border border-secondary text-end"
        value={customQuantity || quantity}
        onChange={handleCustomQuantityChange}
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger className="flex w-20 items-center justify-between gap-2 rounded border px-2 py-1">
        <span>Qty: </span>
        <span>{quantity}</span>
      </PopoverTrigger>
      <PopoverContent className="flex w-32 flex-col gap-1 p-2">
        {Array.from({ length: 9 }, (_, index) => index + 1).map((i: number) => (
          <PopoverClose
            key={i}
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-between',
              }),
            )}
            onClick={() => handleFixedQuantityChange(i)}
          >
            {i}
            <Icons.check
              className={cn(i !== quantity && 'hidden')}
              width={16}
              height={16}
            />
          </PopoverClose>
        ))}
        <PopoverClose
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'content-start justify-between',
            }),
          )}
          onClick={enableCustomQuantityMode}
        >
          10+
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};
