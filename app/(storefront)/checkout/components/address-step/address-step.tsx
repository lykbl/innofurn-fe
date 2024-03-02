import {
  AddressFragmentFragment,
  AddressFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { FragmentType, useFragment } from '@/gql/generated';
import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import AddressCard from '@/(storefront)/checkout/components/address-step/address-card';
import AddressForm from '@/(storefront)/checkout/components/address-form/form';
import { ADDRESSES_QUERY } from '@/gql/queries/address';

const AddressStep = () => {
  const { data: addressesQuery } = useSuspenseQuery(ADDRESSES_QUERY);
  const addressFragments = addressesQuery?.addresses ?? [];
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
    <>
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
    </>
  );
};

export default AddressStep;
