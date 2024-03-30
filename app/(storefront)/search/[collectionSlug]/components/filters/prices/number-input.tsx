import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { FiltersContext } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';
import { useDebounce } from 'react-use';
import { Input } from '@/components/ui/common/input';
import { z } from 'zod';

type NumberInputPropsType = {
  handle: typeof MIN_PRICE_HANDLE | typeof MAX_PRICE_HANDLE;
  label: string;
  setError: Dispatch<SetStateAction<string | null>>;
};
export const MIN_PRICE_HANDLE = 'minPrice';
export const MAX_PRICE_HANDLE = 'maxPrice';
const priceFilterSchema = z.number().min(1).max(99999).optional();

export default function NumberInput({
  handle,
  label,
  setError,
}: NumberInputPropsType) {
  const { optimisticFilters, updateStaticFilter } = useContext(FiltersContext);
  const defaultValue = optimisticFilters[handle]?.toString() || '';
  const [value, setValue] = useState<string>(defaultValue);

  const minPriceSchema = priceFilterSchema.refine(
    (value) =>
      value &&
      handle === MIN_PRICE_HANDLE &&
      optimisticFilters[MAX_PRICE_HANDLE] &&
      value < optimisticFilters[MAX_PRICE_HANDLE],
    { message: 'Min price must be less than max price' },
  );

  const maxPriceSchema = priceFilterSchema.refine(
    (value) =>
      value &&
      handle === MAX_PRICE_HANDLE &&
      optimisticFilters[MIN_PRICE_HANDLE] &&
      value > optimisticFilters[MIN_PRICE_HANDLE],
    { message: 'Max price must be greater than min price' },
  );

  useDebounce(
    () => {
      const schema =
        handle === MIN_PRICE_HANDLE ? minPriceSchema : maxPriceSchema;
      const validationResult = schema.safeParse(Number(value));

      setError(null);
      if (value === '' || validationResult.success) {
        updateStaticFilter(handle, value ? Number(value).toFixed(0) : null);
      } else {
        setError(validationResult.error.errors[0].message);
      }
    },
    500,
    [value],
  );

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value.replace(/^0+/, '');
    setValue(inputValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Input
        id={handle}
        type="number"
        className="appearance-none"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
}
