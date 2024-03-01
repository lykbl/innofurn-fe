
// const ADDRESSES_QUERY = gql(/* GraphQL */ `
//   query addresses {
//     addresses {
//       ...AddressFragment
//     }
//   }
// `);
//
// const AddressStep = ({
//   setAddressStepFinished,
// }: {
//   setAddressStepFinished: (v: boolean) => void;
// }) => {
//   const { data: addressesQuery } = useSuspenseQuery(ADDRESSES_QUERY);
//   const addressFragments = addressesQuery?.addresses ?? [];
//   const addresses = addressFragments.map(
//     (addressFragment: FragmentType<typeof AddressFragmentFragmentDoc>) =>
//       useFragment(AddressFragmentFragmentDoc, addressFragment),
//   );
//   const [selectedAddress, setSelectedAddress] = useState<number>(
//     addresses.find((address) => address.shippingDefault)?.id ?? addresses[0].id,
//   );
//   const handleAddressChange = (addressId: number) => {
//     setSelectedAddress(addressId);
//   };
//
//   return (
//     <>
//       {addresses.map((address) => (
//         <AddressCard
//           key={address.id}
//           address={address}
//           isSelected={address.id === selectedAddress}
//           setSelectedAddress={setSelectedAddress}
//           setAddressStepFinished={setAddressStepFinished}
//         />
//       ))}
//       <Button>Add new address</Button>
//     </>
//   );
// };
//
// export default AddressStep;
