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
        'hover:border-primary/90 rounded border border-primary bg-secondary drop-shadow-lg',
        selected && 'hover:border-primary/90 border-primary',
        className,
      )}
    >
      <motion.div
        className={cn(
          'group-hover:bg-primary/90 h-full w-0 bg-primary duration-300',
        )}
        animate={isInView ? { width: `${fillTo}%` } : { width: 0 }}
      />
    </div>
  );
}
