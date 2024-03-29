import React, { createContext, useOptimistic, useTransition } from 'react';
import { SearchParams } from '@/(storefront)/search/[collectionSlug]/page';
import { useRouter } from 'next/navigation';
import { ProductVariantsForCollectionFilterInput } from '@/gql/generated/graphql';

const STATIC_FILTERS = [
  'search',
  'minPrice',
  'maxPrice',
  'rating',
  'onSaleOnly',
] as const;

type FiltersContextType = {
  optimisticFilters: ProductVariantsForCollectionFilterInput;
  updateOptionFilters: (handle: string, value: string) => void;
  updateStaticFilter: (
    handle: (typeof STATIC_FILTERS)[number],
    value: null | number | string | boolean,
  ) => void;
  filtersUpdating: boolean;
};

export const FiltersContext = createContext<FiltersContextType>({
  optimisticFilters: {
    rating: null,
    maxPrice: null,
    minPrice: null,
    onSaleOnly: false,
    options: [],
  },
  updateOptionFilters: (handle, value) => {},
  updateStaticFilter: (handle, value) => {},
  filtersUpdating: false,
});

const prepareFilters = (searchParams: SearchParams) => {
  const filters = {
    rating: null,
    maxPrice: null,
    minPrice: null,
    onSaleOnly: false,
  } as ProductVariantsForCollectionFilterInput;
  //TODO why does this fix TS error
  filters.options = [];

  for (const [filter, values] of Object.entries(searchParams)) {
    if (values === undefined) {
      continue;
    }

    if (filter === 'minPrice' || filter === 'maxPrice' || filter === 'rating') {
      filters[filter] = Number(Array.isArray(values) ? values[0] : values);
    } else if (filter === 'onSaleOnly') {
      filters[filter] = values === 'true';
    } else {
      filters.options.push({
        handle: filter,
        values: Array.isArray(values) ? values : [values],
      });
    }
  }

  return filters;
};

export const buildFilterInput = (
  collectionSlug: string,
  urlSearchParams: URLSearchParams,
): ProductVariantsForCollectionFilterInput => {
  const dynamicFilters = Array.from(urlSearchParams.keys()).filter(
    (key, index, self) =>
      STATIC_FILTERS.indexOf(key as typeof STATIC_FILTERS[number]) === -1 && self.indexOf(key) === index,
  );

  return {
    search: urlSearchParams.get('search') ?? '',
    collection: collectionSlug,
    options: dynamicFilters
      .map((handle) => {
        return {
          handle,
          values: urlSearchParams.getAll(handle),
        };
      })
      .filter(Boolean),
    minPrice: urlSearchParams.has('minPrice')
      ? Number(urlSearchParams.get('minPrice')) * 100
      : null,
    maxPrice: urlSearchParams.has('maxPrice')
      ? Number(urlSearchParams.get('maxPrice')) * 100
      : null,
    rating: urlSearchParams.has('rating')
      ? Number(urlSearchParams.get('rating'))
      : null,
    onSaleOnly: urlSearchParams.has('onSaleOnly'),
  };
};

export const FiltersProvider = ({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: SearchParams;
}) => {
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    prepareFilters(searchParams),
  );
  const [isUpdating, startTransition] = useTransition();
  const router = useRouter();

  const updateFiltersUrlSearchParams = (
    newOptimisticFilters: ProductVariantsForCollectionFilterInput,
  ) => {
    const newParams = new URLSearchParams();

    STATIC_FILTERS.forEach((filter) => {
      const value = newOptimisticFilters[filter];
      if (value !== null && value !== undefined && value !== false) {
        newParams.append(filter, value.toString());
      }
    });

    newOptimisticFilters.options?.forEach((option) => {
      option.values?.forEach((value) => {
        newParams.append(option.handle, value);
      });
    });

    startTransition(() => {
      setOptimisticFilters(newOptimisticFilters);
      router.push(`?${newParams}`, { scroll: false });
    });
  };

  const contextValue = {
    optimisticFilters,
    filtersUpdating: isUpdating,
    updateOptionFilters: (handle: string, value: string) => {
      const currentOptionFilter = optimisticFilters.options?.find(
        (option) => option.handle === handle,
      );
      const currentValues = new Set(currentOptionFilter?.values || []);
      currentValues.has(value)
        ? currentValues.delete(value)
        : currentValues.add(value);

      const newOptions =
        optimisticFilters.options?.filter(
          (option) => option.handle !== handle,
        ) || [];
      newOptions.push({ handle, values: Array.from(currentValues) });

      return updateFiltersUrlSearchParams({
        ...optimisticFilters,
        options: newOptions,
      });
    },
    updateStaticFilter: (
      handle: string,
      value: null | number | string | boolean,
    ) => {
      updateFiltersUrlSearchParams({
        ...optimisticFilters,
        [handle]: value,
      });
    },
  };

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  );
};
