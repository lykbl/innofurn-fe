import { Accordion } from "@/components/ui/accordion";
import React from "react";
import { AggregatedIndexedAttributeValue } from "@/gql/graphql";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AttributeFilters } from "@/(storefront)/search/[handle]/filters/attributes";
import { OnSaleFilter } from "@/(storefront)/search/[handle]/filters/on-sale";
import { RatingFilter } from "@/(storefront)/search/[handle]/filters/rating";
import { PriceFilter } from "@/(storefront)/search/[handle]/filters/prices";

export const Filters = ({ dynamicAttributes }: { dynamicAttributes: Array<AggregatedIndexedAttributeValue> }) => {
  return (
    <div className="flex flex-col w-1/5 pr-4 gap-4">
      <Accordion type="multiple">
        <AttributeFilters
          dynamicAttributes={dynamicAttributes}
        />
        <RatingFilter
        />
        <PriceFilter />
      </Accordion>
      <OnSaleFilter />
    </div>
  );
}

export const useSearchFilterQuery = () => {
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const { replace } = useRouter();
  const pathname = usePathname();

  const updateSearchFilter = (urlSearchParams: URLSearchParams) => {
    replace(`${pathname}?${urlSearchParams.toString()}`, { scroll: false })
  }

  return {
    urlSearchParams,
    updateSearchFilter,
  };
}
