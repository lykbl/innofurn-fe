import { AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/common/checkbox';
import { ProductOptionValueFragmentFragment } from '@/gql/generated/graphql';

export default function MultiSelectFilterOption({
  valueFragment,
  handleCheckboxClick,
  selectedOptions,
}: {
  valueFragment: ProductOptionValueFragmentFragment;
  handleCheckboxClick: (value: string) => void;
  selectedOptions: Array<string>;
}) {
  const { name } = valueFragment;

  return (
    <AccordionContent key={name} className="flex items-center gap-2 px-1 py-2">
      <Checkbox
        id={name}
        checked={selectedOptions.includes(name)}
        onClick={() => handleCheckboxClick(name)}
      />
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {name}
      </label>
    </AccordionContent>
  );
}
