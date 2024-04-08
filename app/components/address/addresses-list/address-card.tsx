import { AddressFragmentFragment } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import React, { useTransition } from 'react';
import { useMutation } from '@apollo/client';
import { Card } from '@/components/ui/common/card';
import { RemoveAddressMutation } from '@/gql/mutations/address';
import AddressCardContent from '@/components/address/addresses-list/address-card-content';
import AddressControls from '@/components/address/addresses-list/address-card-controls';

export type AddressCardProps = {
  address: AddressFragmentFragment;
  isSelected: boolean;
  handleAddressChange: (address?: AddressFragmentFragment) => void; //TODO infer from parent somehow?
  toggleAddressFormView: () => void;
};

export default function AddressCard({
  address,
  isSelected,
  handleAddressChange,
  toggleAddressFormView,
}: AddressCardProps) {
  const [deleteAddress] = useMutation(RemoveAddressMutation);
  const [isPending, startTransition] = useTransition();

  const handleDeleteAddress = () => {
    startTransition(async () => {
      await deleteAddress({
        variables: {
          id: address.id,
        },
        updateQueries: {
          addresses: (prev, { mutationResult }) => {
            if (mutationResult.errors) {
              return prev;
            }

            return {
              addresses: prev.addresses.filter(
                (cachedAddress: AddressFragmentFragment) =>
                  cachedAddress.id !== address.id,
              ),
            };
          },
        },
      });
      handleAddressChange();
    });
  };

  return (
    <Card
      //TODO add button arias
      className={cn(
        'flex h-full w-full cursor-pointer justify-between rounded border border-input p-4 transition-all ease-in-out',
        isSelected && 'border-primary',
        isPending && 'animate-pulse',
      )}
      onClick={() => handleAddressChange(address)}
    >
      <AddressCardContent
        address={address}
        isSelected={isSelected}
        handleAddressChange={handleAddressChange}
        toggleAddressFormView={toggleAddressFormView}
        handleDeleteAddress={handleDeleteAddress}
      />
      <AddressControls
        isSelected={isSelected}
        handleDeleteAddress={handleDeleteAddress}
        toggleAddressFormView={toggleAddressFormView}
      />
    </Card>
  );
}
