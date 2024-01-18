"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { cn } from "@/lib/utils";
import React, { forwardRef, memo } from "react";
import { Separator } from "@/components/ui/common/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Chat_Message_Statuses, ChatMessage as ChatMessageType } from "@/gql/graphql";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/common/button";
import { InMemoryCache, makeVar, MutationFunction } from "@apollo/client";
import { CHAT_MESSAGE_FRAGMENT } from "@/components/ui/chat/chat-content";

interface IChatMessageProps {
  message: ChatMessageType,
  resendMessage: MutationFunction,
}

const optimisticMessageVar = makeVar<ChatMessageType | null>(null);
const ChatMessage =
  // memo(
  forwardRef<
    React.ElementRef<typeof Card>,
    React.ComponentPropsWithoutRef<typeof Card> & IChatMessageProps
  >((
  {
    message: { id, author, body, createdAt, status },
    className,
    resendMessage,
  }, ref
) => {
  const date = new Date(createdAt);
  let statusIndicator;

  if (status.toLowerCase() === 'error') {
    statusIndicator = <Icons.error className="w-[12px] h-[12px] text-destructive" />;
  } else if (status.toLowerCase() === 'pending') {
    statusIndicator = <Icons.spinner className="animate-spin w-[12px] h-[12px]" />;
  } else {
    statusIndicator = <Icons.check className="w-[12px] h-[12px] text-blue-500" />;
  }

  return (
    <Card
      className={cn(
        "w-[40%] relative",
        author.role === "admin" ? "mr-auto" : "ml-auto",
        className
      )}
      ref={ref}
    >
      <CardHeader className="px-2 pt-2 pb-1">
        <CardTitle className="text-xs">
          {author?.name}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent
        className="px-2 py-1 text-2xs min-h-[50px]"
      >
        {body}
      </CardContent>
      <Separator />
      <CardFooter className="px-2 py-0 text-foreground flex justify-between">
        <TooltipProvider
          skipDelayDuration={1000}
        >
          <Tooltip
            delayDuration={300}
          >
            <TooltipTrigger
              className="text-3xs"
            >
              {new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric"
              }).format(date)}
            </TooltipTrigger>
            <TooltipContent
              className="text-3xs px-2 py-1"
            >
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
              }).format(date)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {statusIndicator}
      </CardFooter>
      {status.toLowerCase() === 'error' && (
        <Button
          onClick={async () => {
            const response = await resendMessage({
              variables: {
                input: {
                  body: body,
                  chatRoomId: 2, //TODO fix htis
                }
              },
              optimisticResponse: {
                sendMessageToChatRoom: {
                  id: id,
                  __typename: 'ChatMessage',
                  body: body,
                  createdAt: new Date().toISOString(),
                  status: 'PENDING',
                  author: {
                    __typename: 'Customer',
                    name: 'You',
                    role: 'CUSTOMER',
                  },
                }
              },
              update: (cache, { data: newMessage, errors }) => {
                if (!newMessage) {
                  return;
                }

                cache.modify({
                  fields: {
                    chatRoomMessages: (existingMessages = {}) => {
                      const newStatus = errors ? Chat_Message_Statuses.Error : newMessage.sendMessageToChatRoom.status;
                      const updatedFragment = cache.updateFragment({
                        id: `ChatMessage:${id}`,
                        fragment: CHAT_MESSAGE_FRAGMENT,
                        broadcast: true,
                      }, () => ({
                        ...newMessage.sendMessageToChatRoom,
                        status: newMessage.sendMessageToChatRoom.status,
                      }))

                      return {
                        data: [
                          ...existingMessages.data.map((message: ChatMessageType) => message.id === id
                            ? updatedFragment
                            : message)
                        ],
                        paginatorInfo: existingMessages.paginatorInfo,
                      };
                    }
                  }
                })
              }
            })
          }}
          variant="ghost"
          className='absolute bottom-[5px] left-[-17px] p-0 hover:bg-none hover:text-blue-500 cursor-pointer'
          asChild
        >
          <Icons.retry
            className="w-[12px] h-[12px]"
          />
        </Button>
      )}
    </Card>
  );
});

export default ChatMessage;
