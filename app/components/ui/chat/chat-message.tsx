"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/common/card";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { Separator } from "@/components/ui/common/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/common/button";
import { MutationFunctionOptions, useQuery } from "@apollo/client";
import { ChatMessageFragment } from "@/components/ui/chat/chat-content";
import {
  ChatMessageFragmentFragment,
  ChatMessageStatus,
  CreateChatMessageInput,
  Exact,
  SendMessageToChatRoomMutation,
} from "@/gql/graphql";
import { makeFragmentData, useFragment } from "@/gql";
import {
  CHECK_ME,
  CHECK_ME_FRAGMENT,
} from "@/components/ui/layout/header/auth-controls";

interface IChatMessageProps {
  message: ChatMessageFragmentFragment;
  resendMessage: (
    options?:
      | MutationFunctionOptions<
          SendMessageToChatRoomMutation,
          Exact<{ input: CreateChatMessageInput }>
        >
      | undefined,
  ) => Promise<any>;
}

const ChatMessage =
  // memo(//TODO revert memo
  forwardRef<
    React.ElementRef<typeof Card>,
    React.ComponentPropsWithoutRef<typeof Card> & IChatMessageProps
  >(
    (
      {
        message: { id, author, body, createdAt, status },
        className,
        resendMessage,
      },
      ref,
    ) => {
      const date = new Date(createdAt);
      const { data: checkMeQuery } = useQuery(CHECK_ME);
      const userData = useFragment(CHECK_ME_FRAGMENT, checkMeQuery?.checkMe);
      const customer = userData?.customer;
      const role = customer?.role;
      const chatRoomId = Number(customer?.activeChatRoom.id);

      let statusIndicator;
      if (status.toLowerCase() === "error") {
        statusIndicator = (
          <Icons.error className="w-[12px] h-[12px] text-destructive" />
        );
      } else if (status.toLowerCase() === "pending") {
        statusIndicator = (
          <Icons.spinner className="animate-spin w-[12px] h-[12px]" />
        );
      } else {
        statusIndicator = (
          <Icons.check className="w-[12px] h-[12px] text-blue-500" />
        );
      }

      //TODO is this necessary?
      if (userData) {
        return;
      }

      return (
        <Card
          className={cn(
            "w-[40%] relative",
            author.role === "admin" ? "mr-auto" : "ml-auto",
            className,
          )}
          ref={ref}
        >
          <CardHeader className="px-2 pt-2 pb-1">
            <CardTitle className="text-xs">{author?.name}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="px-2 py-1 text-2xs min-h-[50px]">
            {body}
          </CardContent>
          <Separator />
          <CardFooter className="px-2 py-0 text-foreground flex justify-between">
            <TooltipProvider skipDelayDuration={1000}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger className="text-3xs">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  }).format(date)}
                </TooltipTrigger>
                <TooltipContent className="text-3xs px-2 py-1">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }).format(date)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {statusIndicator}
          </CardFooter>
          {status.toLowerCase() === "error" && (
            <Button
              onClick={async () => {
                await resendMessage({
                  variables: {
                    input: {
                      chatRoomId,
                      body: body,
                    },
                  },
                  optimisticResponse: {
                    sendMessageToChatRoom: makeFragmentData(
                      {
                        id: id,
                        __typename: "ChatMessage",
                        body: body,
                        createdAt: new Date(),
                        status: ChatMessageStatus.PENDING,
                        author: {
                          __typename: "Customer",
                          name: `${customer?.firstName} ${customer?.lastName}`,
                          role: customer?.role || "",
                        },
                      },
                      ChatMessageFragment,
                    ),
                  },
                  update: (cache, { data: newMessage, errors }) => {
                    if (!newMessage) {
                      return;
                    }

                    cache.modify({
                      fields: {
                        chatRoomMessages: (existingMessages = {}) => {
                          const fragmentData = useFragment(
                            ChatMessageFragment,
                            newMessage.sendMessageToChatRoom,
                          );
                          const newStatus = errors
                            ? ChatMessageStatus.ERROR
                            : fragmentData.status;
                          const updatedFragment = cache.updateFragment(
                            {
                              id: `ChatMessage:${id}`,
                              fragment: ChatMessageFragment,
                            },
                            () => ({
                              ...fragmentData,
                              status: newStatus,
                            }),
                          );

                          return {
                            data: [
                              ...existingMessages.data.map(
                                (message: ChatMessageFragmentFragment) =>
                                  message.id === id ? updatedFragment : message,
                              ),
                            ],
                            paginatorInfo: existingMessages.paginatorInfo,
                          };
                        },
                      },
                    });
                  },
                });
              }}
              variant="ghost"
              className="absolute bottom-[5px] left-[-17px] p-0 hover:bg-none hover:text-blue-500 cursor-pointer"
              asChild
            >
              <Icons.retry className="w-[12px] h-[12px]" />
            </Button>
          )}
        </Card>
      );
    },
  );

export default ChatMessage;
