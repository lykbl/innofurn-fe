import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RatingBar({
  fillTo,
  className,
  selected,
}: {
  fillTo: number;
  className?: string;
  selected?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={cn(
        'rounded border border-primary bg-gray-100 drop-shadow-lg hover:border-primary/90',
        selected && 'border-white hover:border-white/90',
        className,
      )}
    >
      <motion.div
        className={cn(
          'h-full w-0 bg-primary duration-300 group-hover:bg-primary/90',
        )}
        animate={isInView ? { width: `${fillTo}%` } : { width: 0 }}
      />
    </div>
  );
}
