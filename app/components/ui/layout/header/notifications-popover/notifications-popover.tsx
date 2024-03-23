import { Button } from '@/components/ui/common/button';
import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '@/components/icons';

const NotificationsPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icons.bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent>Notifications go here...</PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
