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
    //TODO add more agressive caching :???
    const messagesQuery = useQuery(FETCH_MESSAGES, {
      variables: {
        page: 1,
        first: 5
      },
    });
    const {
      data: queryData,
      loading: loadingMessages,
      error: messagesError,
      fetchMore: fetchMoreMessages,
      subscribeToMore: subscribeToMoreMessages,
    } = messagesQuery;
    const messages = queryData?.chatRoomMessages?.data || [];
    const { currentPage, hasMorePages } = queryData?.chatRoomMessages?.paginatorInfo || {};

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [newPageOffset, setNewScrollOffset] = useState(0);
    useEffect(() => {
      if (!scrollRef.current || loadingMessages) {
        return;
      }

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - newPageOffset;
      setNewScrollOffset(scrollRef.current.scrollHeight);
    }, [loadingMessages]);

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

    useEffect(() => {
      const terminateSubscription = subscribeToMoreMessages({
        document: SUBSCRIBE_TO_CHAT_ROOM,
        updateQuery: (messagesQuery, { subscriptionData, variables }) => {
          const newMessage = subscriptionData.data.updateChatRoom;
          if (!newMessage) {
            return messagesQuery;
          }

          return {
            chatRoomMessages: {
              data: [newMessage],
              paginatorInfo: messagesQuery.chatRoomMessages.paginatorInfo,
              addOnTop: true
            },
          };
        },
        onError: (err) => {
          console.log('ONAERRO', err);
        },
        variables: {},
      });

      return () => terminateSubscription();
    }, [subscribeToMoreMessages]);

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
              className={cn(messages.length === 0 && 'flex items-center')}
            >
              <div className="flex flex-col gap-2">
                {/*TODO fix scrollbar flicker*/}
                {/*TODO ref the spinner ++ rotate it with scroll*/}
                {loadingMessages && <Icons.spinner className="animate-spin m-auto" />}
                {messagesError && <p className="text-red-500 text-xs mx-auto py-2">{'Uh-oh messages could not be loaded!'}</p>}
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
