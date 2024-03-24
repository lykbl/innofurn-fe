'use client';

import { Button } from '@/components/ui/common/button';

type ProductOptionsSelectorProps = {
  availableProductOptionValues: Array<{
    handle: string;
    values: Array<string>;
    label: string;
  }>;
  selectedOptionValues: { [handle: string]: string };
  handleSelectOption: (handle: string, value: string) => void;
};
const ProductOptionsSelector = ({
  availableProductOptionValues,
  selectedOptionValues,
  handleSelectOption,
}: ProductOptionsSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/*TODO use label instead of id*/}
      <div className="flex flex-col gap-2">
        {availableProductOptionValues.map((productOption) => (
          <ProductOptionValues
            key={productOption.handle}
            selectedOptionValues={selectedOptionValues}
            productOption={productOption}
            handleSelectOption={handleSelectOption}
          />
        ))}
      </div>
    </div>
  );
};

const ProductOptionValues = ({
  productOption: { handle, label, values },
  selectedOptionValues,
  handleSelectOption,
}: {
  productOption: { handle: string; label: string; values: Array<string> };
  selectedOptionValues: { [handle: string]: string };
  handleSelectOption: (handle: string, value: string) => void; //TODO infer or smth
}) => {
  return (
    <div className="flex gap-2">
      <h3>{label}:</h3>
      <div className="flex gap-2">
        {values.map((value) => (
          <Button
            className="h-6 border px-2.5 py-0.5 text-xs"
            variant={
              selectedOptionValues[handle] === value ? 'outline' : 'default'
            }
            key={value}
            onClick={() => handleSelectOption(handle, value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductOptionsSelector;
