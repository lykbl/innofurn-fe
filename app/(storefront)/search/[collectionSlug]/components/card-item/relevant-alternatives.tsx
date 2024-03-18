import { ColorOptionFragmentFragment } from '@/gql/generated/graphql';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

export default function RelevantAlternatives({
  colorOptions,
  previewVariantColor,
}: {
  colorOptions?: Array<ColorOptionFragmentFragment>;
  previewVariantColor: (variantId: number) => void;
}) {
  if (!colorOptions?.length) {
    return;
  }

  return (
    <div className="flex justify-center gap-2 py-2">
      {colorOptions
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name }) => (
          <TooltipProvider key={id}>
            <Tooltip>
              <TooltipContent>{name}</TooltipContent>
              <TooltipTrigger
                // onMouseEnter={() => previewVariantColor(null)}
                onMouseEnter={() => previewVariantColor(1)}
              >
                <span
                  // style={{ backgroundColor: '' ColorMap[name] }}
                  style={{ backgroundColor: '' }}
                  className="block h-4 w-4 rounded-full border border-solid border-black"
                />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
}
