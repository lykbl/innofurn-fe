import { PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import * as React from 'react';

const NotificationsTriggerSkeleton = () => {
  return (
    <PopoverTrigger asChild>
      <Button variant="outline">
        <Icons.bell />
      </Button>
    </PopoverTrigger>
  );
};

export default NotificationsTriggerSkeleton;
