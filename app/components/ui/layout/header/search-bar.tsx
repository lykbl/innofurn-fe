'use client';

import { ChangeEventHandler, useState } from 'react';
import { Input } from '@/components/ui/common/input';
import { useLazyQuery } from '@apollo/client';
import { ProductVariantSearchPreviewFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useDebounce } from 'react-use';
import { useToast } from '@/components/ui/use-toast';
import { useFragment } from '@/gql/generated';
import Image from 'next/image';
import { Card } from '@/components/ui/common/card';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FindProductVariantsQuery } from '@/gql/queries/product-variant';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [searchProducts, { data, loading, error }] = useLazyQuery(
    FindProductVariantsQuery,
    {
      variables: {
        search,
      },
    },
  );

  useDebounce(
    async () => {
      if (!search) {
        return;
      }

      await searchProducts();
      if (error) {
        return toast({
          duration: 5000,
          type: 'foreground',
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
    500,
    [search],
  );

  const openSearchDialog: ChangeEventHandler<HTMLInputElement> = (e) => {
    setDialogOpen(true);
    handleSearchChange(e);
  };
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const productVariants = data?.findProductVariants.data.map((item) =>
    useFragment(ProductVariantSearchPreviewFragmentFragmentDoc, item),
  );
  const facetDistribution =
    data?.findProductVariants.paginatorInfo.facetDistribution;

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger>
        <Input value={search} onChange={openSearchDialog} />
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent
          onInteractOutside={() => {
            console.log('otusoide!');
          }}
          className="h-[95%] min-w-[80%] p-12"
        >
          <div className="flex flex-col gap-2">
            <div>
              <Input value={search} onChange={handleSearchChange} />
            </div>
            <div className="flex gap-2">
              {facetDistribution?.map(({ count, collection }) => (
                <Link
                  key={collection.name}
                  href={`/search/${collection.defaultUrl.slug}?search=${search}`}
                  className={buttonVariants({
                    variant: 'outline',
                  })}
                >
                  {collection.name} ({count})
                </Link>
              ))}
            </div>
            {productVariants?.map((item) => (
              <Card key={item.id} className="flex gap-2">
                <Image
                  src={
                    item.primaryImage?.conversions[0] || '/fallback-image.jpg'
                  }
                  alt="hehe"
                  width={75}
                  height={75}
                />
                <div className="flex flex-col gap-2 py-2">{item.name},</div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
