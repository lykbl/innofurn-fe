import {
  AddressFragmentFragment,
  AddressFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { FragmentType, useFragment } from '@/gql/generated';
import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import AddressForm from '@/components/address/address-form/form';
import { MyAddressesQuery } from '@/gql/queries/address';
import AddressCard from '@/components/address/addresses-list/address-card';

export default function AddressesList() {
  const { data: addressesQuery } = useSuspenseQuery(MyAddressesQuery);
  const addressFragments = addressesQuery?.myAddresses ?? [];
  const addresses = addressFragments.map(
    (addressFragment: FragmentType<typeof AddressFragmentFragmentDoc>) =>
      useFragment(AddressFragmentFragmentDoc, addressFragment),
  );
  const defaultAddress =
    addresses.find((address) => address.shippingDefault) ?? addresses[0];
  const [selectedAddress, setSelectedAddress] =
    useState<AddressFragmentFragment | null>(defaultAddress);
  const [editMode, setEditMode] = useState(false);
  const handleAddressChange = (address?: AddressFragmentFragment) => {
    setSelectedAddress(address ?? defaultAddress);
  };
  const toggleAddressFormView = () => {
    setEditMode((p) => !p);
  };

  const toggleNewAddressForm = () => {
    setSelectedAddress(null);
    setEditMode(true);
  };

  if (editMode) {
    return (
      <AddressForm
        address={selectedAddress}
        toggleAddressFormView={toggleAddressFormView}
        handleAddressChange={handleAddressChange}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={address.id === selectedAddress?.id}
          handleAddressChange={handleAddressChange}
          toggleAddressFormView={toggleAddressFormView}
        />
      ))}
      <Button onClick={toggleNewAddressForm}>Add new address</Button>
    </div>
  );
}
