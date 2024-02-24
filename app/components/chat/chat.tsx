'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BiChat } from 'react-icons/bi';
import { Button } from '@/components/ui/common/button';
import ChatContent from '@/components/chat/chat-content';
import { useLockBodyScroll } from 'react-use';
import { useState } from 'react';

export default function Chat() {
  const [windowScrollLocked, setWindowScrollLocked] = useState(false);
  useLockBodyScroll(windowScrollLocked);

  return (
    <Popover>
      <PopoverTrigger asChild className="fixed bottom-16 right-16">
        <Button variant="outline">
          <BiChat size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="top" asChild>
        <ChatContent
          onMouseEnter={() => setWindowScrollLocked(true)}
          onMouseLeave={() => setWindowScrollLocked(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
