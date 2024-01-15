import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ui/chat/chat-message";
import ChatMessageControls from "@/components/ui/chat/chat-message-controls";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@/gql";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useIntersection } from "react-use";
import { Icons } from "@/components/icons";

const FETCH_MESSAGES = gql(/* GraphQL */ `
    query FetchMessages($first: Int! $page: Int!) {
        chatRoomMessages(first: $first, page: $page) {
            data {
                id
                body
                createdAt
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
            }
            paginatorInfo {
                hasMorePages
                currentPage
            }
        }
    }
`)

const SUBSCRIBE_TO_CHAT_ROOM = gql(/* GraphQL */ `
  subscription SubscribeToChatRoom {
      updateChatRoom {
          id
          body
          createdAt
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
      }
  }
`);

//TODO a way to return Card directly :??
const ChatContent = forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentPropsWithoutRef<typeof Card>
>(
  ({className,...props }, forwardRef
) => {
    const messagesQuery = useQuery(FETCH_MESSAGES, {
      variables: {
        page: 1,
        first: 5
      }
    });
    const {
      data: queryData,
      loading: loadingMessages,
      error: messagesError,
      previousData: previousMessages,
      fetchMore: fetchMoreMessages
    } = messagesQuery;
    const messages = queryData?.chatRoomMessages?.data || [];
    const { currentPage, hasMorePages } = queryData?.chatRoomMessages?.paginatorInfo || {};
    // const {
    //   loading: updateLoading,
    //   data: newMessage,
    //   error: subError,
    //   variables: subVars
    // } = useSubscription(SUBSCRIBE_TO_CHAT_ROOM, {
    //   onError: (err) => {
    //     console.log('ONAERRO', err);
    //   },
    //   onData: (received) => {
    //     console.log('ONDATA', received);
    //     if (received.data.data?.updateChatRoom) {
    //       receiveMessage(messages, received.data.data.updateChatRoom);
    //     }
    //   },
    //   onComplete: () => {
    //     console.log('subbed');
    //   }
    // });

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [newPageOffset, setNewScrollOffset] = useState(0);
    useEffect(() => {
      if (!scrollRef.current || loadingMessages) {
        return;
      }

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - newPageOffset;
      setNewScrollOffset(scrollRef.current.scrollHeight);
    }, [messages]);

    const firstMessageRef = useRef<HTMLDivElement | null>(null);
    const intersectionObserverEntry = useIntersection(firstMessageRef, {
      root: scrollRef?.current,
      threshold: 0.1
    });
    useEffect(() => {
      if (!hasMorePages) {
        return;
      }

      if (intersectionObserverEntry?.isIntersecting && currentPage) {
        (async () => await fetchMoreMessages({
          variables: {
            page: currentPage + 1,
          }
        }))();
      }
    }, [intersectionObserverEntry?.isIntersecting]);

    console.log(previousMessages)

    return (
      <Card
        className={cn(
          "p-2 *:px-1 *:py-1 w-[400px]"
        )}
        ref={forwardRef}
        {...props}
      >
        <CardHeader className="py-2">
          <CardTitle>
            <p className="text-xl">
              Customer Chat
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className="h-[33vh] rounded-md border p-4"
          >
            <ScrollAreaViewport
              ref={scrollRef}
            >
              <div className="flex flex-col gap-2">
                {/*//TODO add spinner here*/}
                {/*Fix scroll bar?*/}
                {loadingMessages && <Icons.spinner className="animate-spin" />}
                {messages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    ref={i === 0 ? firstMessageRef : null}
                    message={message}
                  />
                ))}
              </div>
            </ScrollAreaViewport>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <ChatMessageControls />
        </CardFooter>
      </Card>
    );
})

export default ChatContent;
