'use client';

import { ChangeEventHandler, Suspense, useState, useTransition } from 'react';
import { Input } from '@/components/ui/common/input';
import { useDebounce } from 'react-use';
import { Dialog, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';

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
    setSearch(e.target.value.trimStart());
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <Input
          className=""
          value={search}
          onChange={openSearchDialog}
          type="text"
        />
      </DialogTrigger>
      <Suspense>
        <DialogOverlay className="overlay">
          <SearchBarDialogContent
            closeModal={() => setDialogOpen(false)}
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
