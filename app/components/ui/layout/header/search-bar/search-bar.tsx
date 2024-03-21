'use client';

import {
  ChangeEventHandler,
  Suspense,
  useCallback,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Input } from '@/components/ui/common/input';
import { skipToken, useLazyQuery, useSuspenseQuery } from '@apollo/client';
import { ProductVariantSearchPreviewFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useDebounce } from 'react-use';
import { useToast } from '@/components/ui/use-toast';
import { useFragment } from '@/gql/generated';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FindProductVariantsQuery } from '@/gql/queries/product-variant';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/common/button';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
} from '@/components/ui/scroll-area';
import FiveStars from '@/components/ui/common/five-stars';
import { cn } from '@/lib/utils';
import SearchBarDialogContent from '@/components/ui/layout/header/search-bar/dialog-content';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isTransitioning, startTransition] = useTransition();

  useDebounce(
    async () => {
      if (!search) {
        return;
      }

      startTransition(() => {
        setSearchQuery(search);
      });

      if (!dialogOpen) {
        setDialogOpen(true);
      }
    },
    750,
    [search],
  );

  const openSearchDialog: ChangeEventHandler<HTMLInputElement> = (e) => {
    handleSearchChange(e);
  };
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <Input value={search} onChange={openSearchDialog} type="text" />
      </DialogTrigger>
      <Suspense>
        <DialogOverlay className="overlay">
          <SearchBarDialogContent
            setDialogOpen={setDialogOpen}
            search={search}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            isTransitioning={isTransitioning}
          />
        </DialogOverlay>
      </Suspense>
    </Dialog>
  );
}
