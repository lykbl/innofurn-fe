import { AddressFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { FragmentType, gql, useFragment } from '@/gql/generated';
import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import AddressCard from '@/(storefront)/checkout/components/address-card';

const AddressFragment = gql(/* GraphQL */ `
  fragment AddressFragment on Address {
    id
    title
    firstName
    lastName
    lineOne
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
  const [selectedAddress, setSelectedAddress] = useState<number>(
    addresses.find((address) => address.shippingDefault)?.id ?? addresses[0].id,
  );
  const handleAddressChange = (addressId: number) => {
    setSelectedAddress(addressId);
  };

  return (
    <>
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={address.id === selectedAddress}
          setSelectedAddress={setSelectedAddress}
          setAddressStepFinished={setAddressStepFinished}
        />
      ))}
      <Button>Add new address</Button>
    </>
  );
};

export default AddressStep;
