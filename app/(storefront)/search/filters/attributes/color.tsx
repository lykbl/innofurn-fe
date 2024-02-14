import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSearchFilterQuery } from "@/(storefront)/search/filters";

export const ColorFilter = ({ handle, label, values }: { handle: string, label: string, values: Array<{label: string, value: string}> }) => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();

  const handleColorClick = (value: string) => {
    urlSearchParams.has('color', value) ? urlSearchParams.delete('color', value) : urlSearchParams.append(
      'color',
      value
    );
    updateSearchFilter(urlSearchParams)
  }

  return (
    <AccordionItem
      value={handle}
    >
      <AccordionTrigger>{label}</AccordionTrigger>
      <AccordionContent className="flex gap-2">
        {values.map(({ label, value }, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipContent>
                {label}
              </TooltipContent>
              <TooltipTrigger
                onClick={handleColorClick.bind(null, value)}
              >
                    <span
                      style={{ backgroundColor: value }}
                      className="block rounded-full border border-solid border-black w-6 h-6"
                    />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
