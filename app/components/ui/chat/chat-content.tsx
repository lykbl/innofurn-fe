import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import ChatMessage from "@/components/ui/chat/chat-message";
import ChatMessageControls from "@/components/ui/chat/chat-message-controls";
import { forwardRef, useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/components/ui/chat/chat-provider";
import { useQuery, useSubscription } from "@apollo/client";
import { gql } from "@/gql";
import { cn } from "@/lib/utils";
import * as React from "react";

const INIT_MESSAGES = gql(/* GraphQL */ `
    query InitializeChat {
        chatRoomMessages(first: 10) {
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
                perPage
                currentPage
                lastPage
                total
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
  const { messages, loadMessages, receiveMessage } = useContext(ChatContext);
  const { data: initialMessages, loading, error, } = useQuery(INIT_MESSAGES)
  const {
    loading: updateLoading
    , data: newMessage,
    error: subError,
    variables: subVars
  } = useSubscription(SUBSCRIBE_TO_CHAT_ROOM, {
    onError: (err) => {
      console.log('ONAERRO', err);
    },
    onData: (received) => {
      console.log('ONDATA', received);
      if (received.data.data?.updateChatRoom) {
        receiveMessage(messages, received.data.data.updateChatRoom);
      }
    },
    onComplete: () => {
      console.log('subbed');
    }
  });

  useEffect(() => {
    console.log(initialMessages?.chatRoomMessages);
    if (!loading && initialMessages?.chatRoomMessages?.data) {
      loadMessages(initialMessages.chatRoomMessages.data);
    }
  }, [loading]);

  console.log(messages);

  useEffect(() => {
    const addedMessage = messages[messages.length - 1];
    if (addedMessage?.author.role === 'user' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages])
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
            {
              loading ? (
                  <Icons.spinner />
                ) :
                <div className="flex flex-col gap-2">
                  {messages.map((message, i) => (
                    <ChatMessage
                      key={i}
                      author={message.author}
                      message={message.body}
                      date={new Date(message.createdAt)}
                    />
                  ))}
                </div>
            }
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
