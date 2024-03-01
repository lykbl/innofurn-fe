import {
  AddressFragmentFragment,
  AddressFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { FragmentType, gql, useFragment } from '@/gql/generated';
import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import AddressCard from '@/(storefront)/checkout/components/address-card';
import Form from '@/(storefront)/checkout/components/address-form/form';

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
  setAddressStepFinished,
}: {
  setAddressStepFinished: (v: boolean) => void;
}) => {
  const { data: addressesQuery } = useSuspenseQuery(ADDRESSES_QUERY);
  const addressFragments = addressesQuery?.addresses ?? [];
  const addresses = addressFragments.map(
    (addressFragment: FragmentType<typeof AddressFragmentFragmentDoc>) =>
      useFragment(AddressFragmentFragmentDoc, addressFragment),
  );
  const [selectedAddress, setSelectedAddress] =
    useState<AddressFragmentFragment>(
      addresses.find((address) => address.shippingDefault) ?? addresses[0],
    );
  const [editMode, setEditMode] = useState(true);
  const handleAddressChange = (addressId: number) => {
    setSelectedAddress(
      addresses.find((address) => address.id === addressId) ?? addresses[0],
    );
  };

  if (editMode) {
    return <Form address={selectedAddress} />;
  }

  return (
    <>
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={address.id === selectedAddress.id}
          handleAddressChange={handleAddressChange}
          setAddressStepFinished={setAddressStepFinished}
        />
      ))}
      <Button>Add new address</Button>
    </>
  );
};

export default AddressStep;
