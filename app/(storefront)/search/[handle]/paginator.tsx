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
import { useSearchFilterQuery } from '@/(storefront)/search/[handle]/filters';
import { PaginatorInfo } from '@/gql/graphql';

export const Paginator = ({
  paginatorInfo,
}: {
  paginatorInfo: PaginatorInfo;
}) => {
  const { currentPage, lastPage, hasMorePages } = paginatorInfo;
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
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
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
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
