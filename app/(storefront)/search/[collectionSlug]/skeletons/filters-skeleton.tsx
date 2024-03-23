import { Card } from '@/components/ui/common/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';

export default function FiltersSkeleton() {
  return (
    <Card className="pointer-events-none flex w-1/5 animate-pulse flex-col gap-4 p-4">
      <Accordion type="multiple">
        {Array.from({ length: 4 }).map((_, i) => (
          <AccordionItem value="" key={i}>
            <AccordionTrigger className="min-h-14 px-1" />
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
