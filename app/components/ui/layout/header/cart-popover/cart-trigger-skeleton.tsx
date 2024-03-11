import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import * as React from 'react';

const CartTriggerSkeleton = () => {
  return (
    <div>
      <Button
        disabled={true}
        variant="outline"
        className="relative animate-pulse"
      >
        <Icons.shoppingBag />
      </Button>
    </div>
  );
};

export default CartTriggerSkeleton;
