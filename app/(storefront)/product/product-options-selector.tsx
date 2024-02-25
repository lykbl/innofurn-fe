'use client';

import { Button } from '@/components/ui/common/button';

const ProductOptionsSelector = ({
  availableProductOptionValues,
  selectedOptionValues,
  handleSelectOption,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/*TODO use label instead of id*/}
      <div className="flex flex-col gap-2">
        {availableProductOptionValues.map((productOption) => (
          <ProductOptionValues
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
  selectedOptionValues,
  productOption: { label, handle, values },
  handleSelectOption,
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
