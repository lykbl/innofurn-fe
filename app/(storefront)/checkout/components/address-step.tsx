import {
  AddressFragmentFragment,
  AddressFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { FragmentType, gql, useFragment } from '@/gql/generated';
import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import AddressCard from '@/(storefront)/checkout/components/address-card';
import AddressForm from '@/(storefront)/checkout/components/address-form/form';
import { STEPS } from '@/(storefront)/checkout/page';

const AddressFragment = gql(/* GraphQL */ `
  fragment AddressFragment on Address {
    id
    title
    firstName
    lastName
    companyName
    lineOne
    lineTwo
    lineThree
    city
    state
    postcode
    country {
      id
      name
    }
    deliveryInstructions
    contactEmail
    contactPhone
    billingDefault
    shippingDefault
  }
`);

const ADDRESSES_QUERY = gql(/* GraphQL */ `
  query addresses {
    addresses {
      ...AddressFragment
    }
  }
`);

const AddressStep = ({
  setCurrentStep,
}: {
  setCurrentStep: (v: STEPS) => void;
}) => {
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
          setCurrentStep={setCurrentStep}
          toggleAddressFormView={toggleAddressFormView}
        />
      ))}
      <Button onClick={toggleNewAddressForm}>Add new address</Button>
    </>
  );
};

export default AddressStep;
