import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import React from 'react';
import { AddressCardProps } from '@/components/address/addresses-list/address-card';

export default function AddressControls({
  isSelected,
  toggleAddressFormView,
  handleDeleteAddress,
}: Pick<AddressCardProps, 'isSelected' | 'toggleAddressFormView'> & {
  handleDeleteAddress: () => void;
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col justify-between duration-300',
        !isSelected && 'opacity-0',
      )}
    >
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          disabled={!isSelected}
          onClick={toggleAddressFormView}
        >
          <Icons.edit />
        </Button>
        <Button
          variant="outline"
          disabled={!isSelected}
          onClick={handleDeleteAddress}
        >
          <Icons.trash />
        </Button>
      </div>
    </div>
  );
};
