'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/card';
import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';
import { Separator } from '@/components/ui/common/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/common/button';
import { MutationFunctionOptions, useQuery } from '@apollo/client';
import {
  ChatMessageFragmentFragment,
  ChatMessageStatus,
  CheckMeFragmentFragmentDoc,
  CreateChatMessageInput,
  Exact,
  SendMessageToChatRoomMutation,
} from '@/gql/generated/graphql';
import { makeFragmentData, useFragment } from '@/gql/generated';
import { ChatMessageFragment } from '@/gql/fragments/chat';
import { CheckMeQuery } from '@/gql/queries/user';

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
      const { data: checkMeQuery } = useQuery(CheckMeQuery);
      const userData = useFragment(
        CheckMeFragmentFragmentDoc,
        checkMeQuery?.checkMe,
      );
      const customer = userData?.customer;
      const role = customer?.role;
      // const chatRoomId = Number(customer?.activeChatRoom.id); TODO fix
      const chatRoomId = 0;

      let statusIndicator;
      if (status.toLowerCase() === 'error') {
        statusIndicator = (
          <Icons.error className="h-[12px] w-[12px] text-destructive" />
        );
      } else if (status.toLowerCase() === 'pending') {
        statusIndicator = (
          <Icons.spinner className="h-[12px] w-[12px] animate-spin" />
        );
      } else {
        statusIndicator = (
          <Icons.check className="h-[12px] w-[12px] text-blue-500" />
        );
      }

      //TODO is this necessary?
      if (!userData) {
        return;
      }

      return (
        <Card
          className={cn(
            'relative w-[40%]',
            author.role === 'admin' ? 'mr-auto' : 'ml-auto',
            className,
          )}
          ref={ref}
        >
          <CardHeader className="px-2 pb-1 pt-2">
            <CardTitle className="text-xs">{author?.name}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="min-h-[50px] px-2 py-1 text-2xs">
            {body}
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between px-2 py-0 text-foreground">
            <TooltipProvider skipDelayDuration={1000}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger className="py-1 text-3xs">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                  }).format(date)}
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-3xs">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  }).format(date)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {statusIndicator}
          </CardFooter>
          {status.toLowerCase() === 'error' && (
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
                        __typename: 'ChatMessage',
                        body: body,
                        createdAt: new Date().toDateString(),
                        status: ChatMessageStatus.PENDING,
                        author: {
                          __typename: 'Customer',
                          name: `${customer?.firstName} ${customer?.lastName}`,
                          role: customer?.role || '',
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
              className="absolute bottom-[5px] left-[-17px] cursor-pointer p-0 hover:bg-none hover:text-blue-500"
              asChild
            >
              <Icons.retry className="h-[12px] w-[12px]" />
            </Button>
          )}
        </Card>
      );
    },
  );

export default ChatMessage;
