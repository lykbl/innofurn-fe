import React from 'react';
import { AddressCardProps } from '@/components/address/addresses-list/address-card';
export default function AddressCardContent({
  address,
}: AddressCardProps & { handleDeleteAddress: () => void }) {
  return (
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
  );
};
