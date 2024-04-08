import { Card } from '@/components/ui/common/card';

export default function OrdersListSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      {Array.from({ length: 5 }, (_, i) => (
        <Card className="h-120 p-4" key={i} />
      ))}
    </div>
  );
}
