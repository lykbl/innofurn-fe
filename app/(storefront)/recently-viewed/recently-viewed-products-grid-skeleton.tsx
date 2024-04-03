import ProductCardSkeleton from '@/skeletons/product/product-card-skeleton';

const MAX_PRODUCTS = 15;

export default function RecentlyViewedProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: MAX_PRODUCTS }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
