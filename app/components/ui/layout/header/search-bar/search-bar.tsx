'use client';

import {
  ChangeEventHandler,
  Suspense,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Input } from '@/components/ui/common/input';
import { useDebounce } from 'react-use';
import { Dialog, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';

import SearchBarDialogContent from '@/components/ui/layout/header/search-bar/dialog-content';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k' && !dialogOpen) {
        setDialogOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
  const closeModal = () => {
    setDialogOpen(false);
    setSearch('');
  };
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value.trimStart());
  };

  return (
    <Dialog open={dialogOpen}>
      <div className="relative">
        <DialogTrigger asChild>
          <Input
            className="w-60"
            value={search}
            onChange={openSearchDialog}
            placeholder="Search anything..."
            type="text"
          />
        </DialogTrigger>
        <kbd className="pointer-events-none absolute right-2 top-[50%] hidden h-5 translate-y-[-50%] select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      {/* TODO fix old search showing? */}
      <Suspense>
        <DialogOverlay className="overlay">
          <SearchBarDialogContent
            closeModal={closeModal}
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
