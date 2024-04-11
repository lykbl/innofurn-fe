import ProductCardSkeleton from '@/skeletons/product/product-card-skeleton';

export default function AssociatedProductsSkeleton() {
  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
