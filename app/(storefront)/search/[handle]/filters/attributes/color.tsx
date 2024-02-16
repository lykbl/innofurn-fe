import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";
import { cn } from "@/lib/utils";

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
      <AccordionTrigger
        className="px-1"
      >{label}
      </AccordionTrigger>
      <AccordionContent className="flex gap-2 pt-2 px-1">
        {values.map(({ label, value }, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipContent>
                {label}
              </TooltipContent>
              <TooltipTrigger
                onClick={handleColorClick.bind(null, label)}
              >
                <span
                  style={{ backgroundColor: value }}
                  className={cn(
                    "block rounded-full border border-solid border-black w-6 h-6",
                    urlSearchParams.has('color', label) && "outline-1 outline outline-offset-2 outline-black"
                  )}
                />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
