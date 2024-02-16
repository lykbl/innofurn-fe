import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/common/checkbox";
import { useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";

export const MultiSelectFilter = ({ handle, label, values }: { handle: string, label: string, values: Array<string> }) => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();

  const handleCheckboxClick = (value: string) => {
    urlSearchParams.has(handle, value) ? urlSearchParams.delete(handle, value) : urlSearchParams.append(handle, value);
    updateSearchFilter(urlSearchParams)
  }

  return (
    <AccordionItem
      value={handle}
    >
      <AccordionTrigger
        className="px-1"
      >
        {label}
      </AccordionTrigger>
      {values.map((value, index) => (
        <AccordionContent
          key={index}
          className="flex gap-2 items-center px-1"
        >
          <Checkbox
            id={value}
            defaultChecked={urlSearchParams.has(handle, value)}
            onClick={handleCheckboxClick.bind(null, value)}
          />
          <label
            htmlFor={value}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {value}
          </label>
        </AccordionContent>
      ))}
    </AccordionItem>
  );
}
