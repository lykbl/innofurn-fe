'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BiChat } from "react-icons/bi";
import { Button } from "@/components/ui/common/button";
import ChatContent from "@/components/ui/chat/chat-content";

export default function Chat() {
  return (
      <Popover>
        <PopoverTrigger
          asChild
          className="fixed right-16 bottom-16"
        >
          <Button variant="outline">
            <BiChat size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(e) => {
            //prevents tooltip trigger
            e.preventDefault();
          }}
          align="end"
          side="top"
          asChild
        >
          <ChatContent />
        </PopoverContent>
      </Popover>
  );
}
