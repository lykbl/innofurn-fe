import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/card';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';
import ChatMessageControls from '@/components/chat/chat-message-controls';
import { forwardRef, Suspense, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as React from 'react';
import { Icons } from '@/components/icons';
import ChatMessages from '@/components/chat/chat-messages';
import { SendMessageMutation } from '@/gql/mutations/chat';

//TODO a way to return Card directly :??
const ChatContent = forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentPropsWithoutRef<typeof Card>
>(({ className, ...props }, forwardRef) => {
  //TODO add more agressive caching :???
  const [tempMessageId, setTempMessageId] = useState(1);
  const [sendMessage, { loading: isMessageSending }] =
    useMutation(SendMessageMutation);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card className="w-[400px] p-2 *:px-1 *:py-1" ref={forwardRef} {...props}>
      <CardHeader className="py-2">
        <CardTitle className="text-xl">Customer Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex h-[33vh] rounded-md border p-4">
          <Suspense
            fallback={<Icons.spinner className="m-auto animate-spin" />}
          >
            <ScrollAreaViewport ref={scrollRef}>
              <ChatMessages sendMessage={sendMessage} scrollRef={scrollRef} />
            </ScrollAreaViewport>
          </Suspense>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <ChatMessageControls
          scrollRef={scrollRef}
          sendMessage={sendMessage}
          isMessageSending={isMessageSending}
          setTempMessageId={setTempMessageId}
          tempMessageId={tempMessageId}
        />
      </CardFooter>
    </Card>
  );
});

export default ChatContent;
