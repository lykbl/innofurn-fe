import { AddressFragmentFragment } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import React, { useTransition } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql/generated';

type AddressCardProps = {
  address: AddressFragmentFragment;
  isSelected: boolean;
  handleAddressChange: (address?: AddressFragmentFragment) => void; //TODO infer from parent somehow?
  setAddressStepFinished: (v: boolean) => void;
  toggleAddressFormView: () => void;
};

const REMOVE_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation removeAddress($id: IntID!) {
    removeAddress(id: $id)
  }
`);

const AddressCard = ({
  address,
  isSelected,
  handleAddressChange,
  setAddressStepFinished,
  toggleAddressFormView,
}: AddressCardProps) => {
  const [deleteAddress] = useMutation(REMOVE_ADDRESS_MUTATION);
  const [isPending, startTransition] = useTransition();

  const handleDeleteAddress = () => {
    startTransition(async () => {
      const response = await deleteAddress({
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
    <div
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
        setAddressStepFinished={setAddressStepFinished}
        toggleAddressFormView={toggleAddressFormView}
        handleDeleteAddress={handleDeleteAddress}
      />
    </div>
  );
};

const AddressCardContent = ({
  address,
  isSelected,
  setAddressStepFinished,
  toggleAddressFormView,
  handleDeleteAddress,
}: AddressCardProps & { handleDeleteAddress: () => void }) => {
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
          handleDeleteAddress={handleDeleteAddress}
          isSelected={isSelected}
          setAddressStepFinished={setAddressStepFinished}
          toggleAddressFormView={toggleAddressFormView}
        />
      }
    </>
  );
};

const AddressControls = ({
  isSelected,
  setAddressStepFinished,
  toggleAddressFormView,
  handleDeleteAddress,
}: Pick<
  AddressCardProps,
  'isSelected' | 'setAddressStepFinished' | 'toggleAddressFormView'
> & { handleDeleteAddress: () => void }) => {
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
      <Button variant="default" onClick={() => setAddressStepFinished(true)}>
        Continue
      </Button>
    </div>
  );
};

export default AddressCard;
