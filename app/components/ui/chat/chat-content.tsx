import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import ChatMessage from "@/components/ui/chat/chat-message";
import ChatMessageControls from "@/components/ui/chat/chat-message-controls";
import { forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "@/components/ui/chat/chat-provider";
import { useQuery, useSubscription } from "@apollo/client";
import { gql } from "@/gql";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useCallbackRef, useRefToCallback } from "use-callback-ref";
import { useIntersection } from "react-use";

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
>(({className,...props }, forwardRef) => {
  const { messages, messagesFetched, receiveMessage } = useContext(ChatContext);
  const [newPageOffset, setNewScrollOffset] = useState(0);

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
  useEffect(() => {
    const addedMessage = messages[messages.length - 1];
    if (addedMessage?.author.role === 'user' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - newPageOffset;
      setNewScrollOffset(scrollRef.current.scrollHeight)
    }
  }, [messages])

  const [page, setPage] = useState(1);
  const {
    data: fetchedMessages,
    loading: fetchingMoreMessages,
    error: messageLoadError,
    fetchMore: fetchMoreMessages,
  } = useQuery(FETCH_MESSAGES, {
    variables: {
      page: 1,
      first: 5,
    }
  })
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!fetchingMoreMessages && fetchedMessages?.chatRoomMessages?.data) {
      messagesFetched(fetchedMessages.chatRoomMessages.data);
      setPage((prev) => prev + 1);
    }
  }, [fetchingMoreMessages]);

  const firstMessageRef = useRef<HTMLDivElement | null>(null);

  const intersectionObserverEntry = useIntersection(firstMessageRef, {
    root: scrollRef?.current,
    threshold: 1,
  });

  useEffect(() => {
    if (!intersectionObserverEntry) {
      return;
    }

    console.log(scrollRef)
    if (intersectionObserverEntry.isIntersecting && page !== -1) {
      (async () => {
        const response = await fetchMoreMessages({
          variables: {
            page: page,
          }
        });
        if (response.errors) {
        }
        if (response.data) {
          const newMessages = response.data.chatRoomMessages.data;
          const hasMorePages = response.data.chatRoomMessages.paginatorInfo.hasMorePages;
          const currentPage = response.data.chatRoomMessages.paginatorInfo.currentPage;
          messagesFetched(newMessages);
          if (hasMorePages) {
            setPage(currentPage + 1);
          } else {
            setPage(-1);
          }
        }
      })()
    }
  }, [intersectionObserverEntry?.isIntersecting]);

  return (
    <Card
      className={cn(
        "p-2 *:px-1 *:py-1 w-[400px]",
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
