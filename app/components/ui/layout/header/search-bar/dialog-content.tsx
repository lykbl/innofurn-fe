import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/common/input';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/common/button';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import FiveStars from '@/components/ui/common/five-stars';
import { ChangeEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { FindProductVariantsQuery } from '@/gql/queries/product-variant';
import { useFragment } from '@/gql/generated';
import { ProductVariantSearchPreviewFragmentFragmentDoc } from '@/gql/generated/graphql';

export default function SearchBarDialogContent({
  closeModal,
  search,
  searchQuery,
  handleSearchChange,
  isTransitioning,
}: {
  closeModal: () => void;
  search: string;
  searchQuery: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isTransitioning: boolean;
}) {
  const { toast } = useToast();
  const { data, error } = useSuspenseQuery(
    FindProductVariantsQuery,
    search ? { variables: { search: searchQuery } } : skipToken,
  );

  if (error) {
    toast({
      duration: 5000,
      type: 'foreground',
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  }

  const productVariants = data?.findProductVariants.data.map((item) =>
    useFragment(ProductVariantSearchPreviewFragmentFragmentDoc, item),
  );
  const facetDistribution =
    data?.findProductVariants.paginatorInfo.facetDistribution;

  return (
    <DialogContent
      onEscapeKeyDown={closeModal}
      onPointerDownOutside={closeModal}
      className="flex h-[95%] min-w-[80%] flex-col gap-4 p-12"
    >
      <div className="flex flex-col gap-2 pr-3">
        <Input value={search} onChange={handleSearchChange} />
        <div className="flex gap-2">
          {facetDistribution?.map(({ count, collection }, i) => (
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
      </div>
      <ScrollArea>
        <ScrollAreaViewport>
          <div
            className={cn(
              'flex flex-col gap-2 pr-3',
              isTransitioning && 'animate-pulse',
            )}
          >
            {productVariants?.map((item) => (
              <Button
                variant="outline"
                className="flex h-full w-full items-start justify-start gap-2 overflow-hidden rounded bg-secondary p-2 ring-inset"
                asChild
                key={item.id}
                onClick={closeModal}
              >
                <Link href={`/product/${item.product.defaultUrl.slug}`}>
                  <Image
                    src={
                      item.primaryImage?.conversions[0] || '/fallback-image.jpg'
                    }
                    alt="hehe"
                    width={125}
                    height={125}
                    className="rounded-lg"
                  />
                  <div className="flex w-full justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <h2 className="flex items-center gap-2">
                          {item.name}
                          <FiveStars
                            rating={item.averageRating}
                            reviewsCount={item.reviewsCount}
                          />
                        </h2>
                        <p>By {item.product.brand.name}</p>
                      </div>
                      <p className="text-xs">{item.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/*TODO add actual logic*/}
                      <p>Starting at: {item.prices[0].price.format}</p>
                      <Button variant="default" tabIndex={-1}>
                        {item.product.variantsCount} more options
                      </Button>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </ScrollAreaViewport>
        <ScrollBar />
      </ScrollArea>
      <DialogClose onClick={closeModal} />
    </DialogContent>
  );
}
