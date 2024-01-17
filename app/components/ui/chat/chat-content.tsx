import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ui/chat/chat-message";
import ChatMessageControls from "@/components/ui/chat/chat-message-controls";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@/gql";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useIntersection } from "react-use";
import { Icons } from "@/components/icons";
import { makeVar } from '@apollo/client';

const FETCH_MESSAGES = gql(/* GraphQL */ `
    query FetchMessages($first: Int! $page: Int!) {
        chatRoomMessages(first: $first, page: $page) {
            data {
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
      }
  }
`);

const SEND_MESSAGE = gql(/* GraphQL */ `
    mutation SendMessageToChatRoom($input: CreateChatMessageInput!) {
        sendMessageToChatRoom(input: $input) {
            id
            body
            status
            author {
                ... on Customer {
                    name
                    role
                }
                ... on Staff {
                    name
                    role
                }
            }
            createdAt
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
        first: 2
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

      // scrollRef.current.scrollTop = scrollRef.current.scrollHeight - newPageOffset;
      // setNewScrollOffset(scrollRef.current.scrollHeight);
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
        updateQuery: (messagesQuery, { subscriptionData }) => {
          const newMessage = subscriptionData.data.updateChatRoom;
          if (!newMessage) {
            return messagesQuery;
          }

          return {
            chatRoomMessages: {
              ...messagesQuery.chatRoomMessages,
              data: [newMessage],
            },
          };
        },
        onError: (err) => {
          console.log('ONAERRO', err);
        },
      });

      return () => terminateSubscription();
    }, [subscribeToMoreMessages]);
    const optimisticMessageVar = makeVar(null);

    const [sendMessage, { loading: isMessageSending, error: messageSendFailed }] = useMutation(SEND_MESSAGE, {
      update(cache, { data: newMessage, errors }) {
        cache.modify({
          fields: {
            chatRoomMessages: (existingMessages = {}) => {
              let newMessageData = newMessage?.sendMessageToChatRoom ?? optimisticMessageVar();
              if (!newMessageData) {
                return existingMessages;
              }

              if (!errors) {
                optimisticMessageVar(newMessageData);
              } else {
                newMessageData = {
                  ...newMessageData,
                  status: 'ERROR', //TODO improve
                };
              }

              return {
                data: [...existingMessages.data, newMessageData],
                paginatorInfo: existingMessages.paginatorInfo,
              };
            }
          }
        })
        // scrollRef?.current.scrollTo(0, scrollRef.current.scrollHeight);
      },
    });

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
                {messages.map((message, i) => {
                  return <ChatMessage
                    key={i}
                    ref={i === 0 ? firstMessageRef : null}
                    message={message}
                  />
                })}
              </div>
            </ScrollAreaViewport>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <ChatMessageControls
            scrollRef={scrollRef}
            sendMessage={sendMessage}
          />
        </CardFooter>
      </Card>
    );
})

export default ChatContent;
