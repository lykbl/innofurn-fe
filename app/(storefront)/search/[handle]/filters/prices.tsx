import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/common/input";
import { Dispatch, SetStateAction, useState } from "react";
import { useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";
import { useDebounce } from "react-use";

const MAX_PRICE = 999999;
const MIN_PRICE = 0;
const MIN_PRICE_HANDLE = "minPrice";
const MAX_PRICE_HANDLE = "maxPrice";

export const PriceFilter = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <AccordionItem value="price">
      <AccordionTrigger className="px-1">Price</AccordionTrigger>
      <AccordionContent>
        <div className="flex gap-2 text-xs p-2">
          <NumberInput
            handle={MIN_PRICE_HANDLE}
            error={error}
            setError={setError}
          />
          <NumberInput
            handle={MAX_PRICE_HANDLE}
            error={error}
            setError={setError}
          />
        </div>
        {error && <span className="px-2 text-red-500 text-xs">{error}</span>}
      </AccordionContent>
    </AccordionItem>
  );
};

type NumberInputPropsType = {
  handle: typeof MIN_PRICE_HANDLE | typeof MAX_PRICE_HANDLE;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
};
const NumberInput = ({ handle, error, setError }: NumberInputPropsType) => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const defaultValue = urlSearchParams.get(handle) || "";
  const [value, setValue] = useState<string>(defaultValue);

  useDebounce(
    () => {
      if (error) {
        return;
      }

      value
        ? urlSearchParams.set(handle, Number(value).toFixed(0).toString())
        : urlSearchParams.delete(handle);
      updateSearchFilter(urlSearchParams);
    },
    500,
    [value],
  );

  const handleInputChange = (key: string, value: string) => {
    const intValue = Number(value);
    if (intValue >= MAX_PRICE || intValue < MIN_PRICE) {
      setError("Invalid value");

      return;
    }

    const compareValue =
      key === MIN_PRICE_HANDLE
        ? Number(urlSearchParams.get(MAX_PRICE_HANDLE))
        : Number(urlSearchParams.get(MIN_PRICE_HANDLE));
    if (
      key === MIN_PRICE_HANDLE &&
      compareValue &&
      intValue &&
      intValue >= compareValue
    ) {
      setError("Min price must be less than max price");
    } else if (
      key === MAX_PRICE_HANDLE &&
      compareValue &&
      intValue &&
      intValue <= compareValue
    ) {
      setError("Max price must be greater than min price");
    } else {
      setError(null);
    }

    setValue(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{handle === MIN_PRICE_HANDLE ? "Min" : "Max"}</label>
      <Input
        id={handle}
        type="number"
        className="appearance-none"
        value={value}
        onChange={({ currentTarget }) =>
          handleInputChange(handle, currentTarget.value)
        }
      />
    </div>
  );
};
