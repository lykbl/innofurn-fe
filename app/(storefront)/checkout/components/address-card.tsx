import { AddressFragmentFragment } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import React from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql/generated';

type AddressCardProps = {
  address: AddressFragmentFragment;
  isSelected: boolean;
  handleAddressChange: (addressId: number) => void;
  setAddressStepFinished: (v: boolean) => void;
  toggleAddressFormView: () => void;
};

const AddressCard = ({
  address,
  isSelected,
  handleAddressChange,
  setAddressStepFinished,
  toggleAddressFormView,
}: AddressCardProps) => {
  return (
    <div
      //TODO add button arias
      className={cn(
        'flex h-full w-full cursor-pointer justify-between rounded border border-input p-4 transition-all duration-500 ease-in-out',
        isSelected && 'border-primary',
      )}
      onClick={() => handleAddressChange(address.id)}
    >
      <AddressCardContent
        address={address}
        isSelected={isSelected}
        handleAddressChange={handleAddressChange}
        setAddressStepFinished={setAddressStepFinished}
        toggleAddressFormView={toggleAddressFormView}
      />
    </div>
  );
};

const AddressCardContent = ({
  address,
  isSelected,
  setAddressStepFinished,
  toggleAddressFormView,
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
          addressId={address.id}
          isSelected={isSelected}
          setAddressStepFinished={setAddressStepFinished}
          toggleAddressFormView={toggleAddressFormView}
        />
      }
    </>
  );
};

const REMOVE_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation removeAddress($id: IntID!) {
    removeAddress(id: $id)
  }
`);

const AddressControls = ({
  isSelected,
  setAddressStepFinished,
  toggleAddressFormView,
  addressId,
}: Pick<
  AddressCardProps,
  'isSelected' | 'setAddressStepFinished' | 'toggleAddressFormView'
> & { addressId: number }) => {
  const [deleteAddress] = useMutation(REMOVE_ADDRESS_MUTATION);
  const handleDeleteAddress = async () => {
    const response = await deleteAddress({
      variables: {
        id: addressId,
      },
      updateQueries: {
        addresses: (prev, { mutationResult }) => {
          if (mutationResult.errors) {
            return prev;
          }

          return {
            addresses: prev.addresses.filter(
              (address: AddressFragmentFragment) => address.id !== addressId,
            ),
          };
        },
      },
    });
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col justify-between',
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
      <Button variant="default" onClick={() => setAddressStepFinished(true)}>
        Continue
      </Button>
    </div>
  );
};

export default AddressCard;
