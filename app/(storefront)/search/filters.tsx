import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FiveStars } from "@/components/rating/rating-breakdown";
import { Checkbox } from "@/components/ui/common/checkbox";
import React from "react";
import { AggregatedIndexedAttributeValue } from "@/gql/graphql";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Filters = ({ dynamicAttributes }: { dynamicAttributes: Array<AggregatedIndexedAttributeValue> }) => {
  return (
    <div className="flex flex-col w-1/5 pr-4 gap-4">
      <Accordion type="multiple">
        <AttributeFilters dynamicAttributes={dynamicAttributes} />
        <RatingFilter />
      </Accordion>
      <div className="flex items-center space-x-2">
        <Checkbox id="on-sale" />
        <label
          htmlFor="on-sale"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          On Sale
        </label>
      </div>
    </div>
  );
}

const RatingFilter = (ratingFilter: number|null) => {
  const selectedFilter = ratingFilter ?? 3;
  const [rating, setRating] = React.useState<number>(selectedFilter);

  const handleStarHover = (index: number) => {
    setRating(index + 1);
  }

  const resetFilter = () => {
    setRating(selectedFilter);
  }

  return (
    <AccordionItem value="rating">
      <AccordionTrigger>Rating</AccordionTrigger>
      <AccordionContent
        className="flex gap-2 text-xs"
      >
        <FiveStars filledStars={rating} onMouseOver={handleStarHover} onMouseLeave={resetFilter} />
        {rating === 5 ? '' : <span>& Up</span>}
      </AccordionContent>
    </AccordionItem>
  );
}

const AttributeFilters = ({ dynamicAttributes }: { dynamicAttributes: Array<AggregatedIndexedAttributeValue> }) => {
  return (
      dynamicAttributes.map((
        { values, handle, label, type },
        index
      ) =>
        <AttributeFilterInTypeContext
          key={index}
          values={values}
          handle={handle}
          label={label}
          type={type}
        />
      )
  );
}

const AttributeFilterInTypeContext = ({ values, handle, label, type }) => {
  if (type === "color") {
    return <ColorFilter
      values={values}
      handle={handle}
      label={label}
    />
  } else if (type === "multi-select") {
    return <MultiSelectFilter
      values={values}
      handle={handle}
      label={label}
    />
  } else {
    console.log("Unsupported filter type", type);
  }
}

const ColorFilter = ({ handle, label, values }) => {
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
                  <TooltipTrigger>
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

const MultiSelectFilter = ({ handle, label, values }) => {
  const [selected, setSelected] = React.useState<Array<string>>([]);

  return (
    <AccordionItem
      value={handle}
    >
      <AccordionTrigger>{label}</AccordionTrigger>
      {values.map((value, index) => (
        <AccordionContent
          key={index}
          className="flex gap-2 items-center"
        >
          <Checkbox
            id={value}
            onClick={() => {
              setSelected([...selected, value]);
            }}
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
