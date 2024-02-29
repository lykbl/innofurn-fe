import { AddressFragmentFragment } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import React from 'react';

type AddressCardProps = {
  address: AddressFragmentFragment;
  isSelected: boolean;
  setSelectedAddress: (addressId: number) => void;
  setAddressStepFinished: (v: boolean) => void;
};

const AddressCard = ({
  address,
  isSelected,
  setSelectedAddress,
  setAddressStepFinished,
}: AddressCardProps) => {
  return (
    <div
      //TODO add button arias
      className={cn(
        'flex h-full w-full justify-between rounded border border-input p-4 transition-all duration-500 ease-in-out',
        isSelected && 'border-primary',
      )}
      onClick={() => setSelectedAddress(address.id)}
    >
      <AddressCardContent
        address={address}
        isSelected={isSelected}
        setSelectedAddress={setSelectedAddress}
        setAddressStepFinished={setAddressStepFinished}
      />
    </div>
  );
};

const AddressCardContent = ({
  address,
  isSelected,
  setAddressStepFinished,
}: AddressCardProps) => {
  return (
    <>
      <div className="flex h-full flex-col gap-12 text-start text-sm font-medium">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-2xl">{address.title}</p>
          </div>
          <div>
            <p>
              <span className="font-medium">Name: </span>
              <span>
                {address.firstName} {address.lastName}
              </span>
            </p>
            <p>
              <span className="font-medium">Address: </span>
              <span>
                {address.lineOne}, {address.city}, {address.postcode},{' '}
                {address.country.name}
              </span>
            </p>
            <p>
              <span className="font-medium">Contact: </span>
              <span>
                {address.contactPhone}, {address.contactEmail}
              </span>
            </p>
          </div>
        </div>
        <p>
          <span className="font-medium">Extra notes: </span>
          <span>{address.deliveryInstructions}</span>
        </p>
      </div>
      {
        <AddressControls
          isSelected={isSelected}
          setAddressStepFinished={setAddressStepFinished}
        />
      }
    </>
  );
};

const AddressControls = ({
  isSelected,
  setAddressStepFinished,
}: Pick<AddressCardProps, 'isSelected' | 'setAddressStepFinished'>) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col justify-between',
        !isSelected && 'opacity-0',
      )}
    >
      <div className="flex justify-between gap-2">
        <Button variant="outline">
          <Icons.edit />
        </Button>
        <Button variant="outline">
          <Icons.trash />
        </Button>
      </div>
      <Button variant="default" onClick={() => setAddressStepFinished(true)}>
        Continue
      </Button>
    </div>
  );
};

export default AddressCard;
