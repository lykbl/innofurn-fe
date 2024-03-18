import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import React from 'react';
import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import { PaginatorInfoFragmentFragmentDoc } from '@/gql/generated/graphql';
import { FragmentType, useFragment } from '@/gql/generated';
import { buttonVariants } from '@/components/ui/common/button';

export const Paginator = ({
  paginatorInfo,
}: {
  paginatorInfo: FragmentType<typeof PaginatorInfoFragmentFragmentDoc>;
}) => {
  const { currentPage, lastPage, hasMorePages } = useFragment(
    PaginatorInfoFragmentFragmentDoc,
    paginatorInfo,
  );
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const handlePageChange = (page: number) => {
    urlSearchParams.set('page', page.toString());
    updateSearchFilter(urlSearchParams);
  };
  const pagesRange = Array.from(
    { length: 6 },
    (_, i) => Number(currentPage) + i - 3,
  ).filter((page) => page > 0 && page <= lastPage);

  return (
    <Pagination>
      <PaginationContent className="flex gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={buttonVariants({ variant: 'outline' })}
          />
        </PaginationItem>
        {pagesRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasMorePages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{lastPage}</PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={buttonVariants({ variant: 'outline' })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
