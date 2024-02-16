import { AggregatedIndexedAttributeValue } from "@/gql/graphql";
import React from "react";
import { ColorFilter } from "@/(storefront)/search/[handle]/filters/attributes/color";
import { MultiSelectFilter } from "@/(storefront)/search/[handle]/filters/attributes/multi-select";

export const AttributeFilters = ({ dynamicAttributes }: { dynamicAttributes: Array<AggregatedIndexedAttributeValue> }) => {
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

const AttributeFilterInTypeContext = ({ values, handle, label, type }: { values: Array<any>, handle: string, label: string, type: string }) => {
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
