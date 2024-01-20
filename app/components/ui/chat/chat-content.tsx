import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import ChatMessageControls from "@/components/ui/chat/chat-message-controls";
import { forwardRef, Suspense, useEffect, useRef, useState } from "react";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import * as React from "react";
import { Icons } from "@/components/icons";
import ChatMessages from "@/components/ui/chat/chat-messages";

const SEND_MESSAGE = gql(/* GraphQL */ `
    mutation SendMessageToChatRoom($input: CreateChatMessageInput!) {
        sendMessageToChatRoom(input: $input) {
            ...ChatMessageFragment
        }
    }
`);
export const ChatMessageFragment = gql(/* GraphQL */ `
    fragment ChatMessageFragment on ChatMessage {
        id
        body
        createdAt
        status
        author {
            ... on Customer {
                role
                name
            }
            ... on Staff {
                role
                name
            }
        }
    }`);

//TODO a way to return Card directly :??
const ChatContent = forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentPropsWithoutRef<typeof Card>
>(
  ({ className, ...props }, forwardRef
) => {
    //TODO add more agressive caching :???
    const [tempMessageId, setTempMessageId] = useState(1);
    const [sendMessage, { loading: isMessageSending }] = useMutation(SEND_MESSAGE);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
      <Card
        className='p-2 *:px-1 *:py-1 w-[400px]'
        ref={forwardRef}
        {...props}
      >
        <CardHeader className="py-2">
          <CardTitle className="text-xl">
            Customer Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className="flex h-[33vh] rounded-md border p-4"
          >
            <Suspense fallback={<Icons.spinner className="animate-spin m-auto" />}>
              <ScrollAreaViewport
                ref={scrollRef}
              >
                <ChatMessages
                  sendMessage={sendMessage}
                  scrollRef={scrollRef}
                />
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
})

export default ChatContent;
