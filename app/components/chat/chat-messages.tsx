import { gql, useFragment } from "@/gql";
import ChatMessage from "@/components/chat/chat-message";
import * as React from "react";
import { ChatMessageFragment } from "@/components/chat/chat-content";
import {
  MutationFunctionOptions,
  useQuery,
  useSuspenseQuery,
} from "@apollo/client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useIntersection } from "react-use";
import {
  CreateChatMessageInput,
  Exact,
  SendMessageToChatRoomMutation,
} from "@/gql/graphql";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  CHECK_ME,
  CHECK_ME_FRAGMENT,
} from "@/components/ui/layout/header/auth-controls";

const PAGE_SIZE = 3;
const STARTING_PAGE = 1;

const FETCH_MESSAGES = gql(/* GraphQL */ `
  query FetchMessagesInside($chatRoomId: IntID!, $page: Int!, $first: Int!) {
    chatRoomMessages(chatRoomId: $chatRoomId, page: $page, first: $first) {
      data {
        ...ChatMessageFragment
      }
      paginatorInfo {
        hasMorePages
        currentPage
      }
    }
  }
`);

const SUBSCRIBE_TO_CHAT_ROOM = gql(/* GraphQL */ `
  subscription SubscribeToChatRoom($chatRoomId: IntID!) {
    updateChatRoom(chatRoomId: $chatRoomId) {
      ...ChatMessageFragment
    }
  }
`);

interface IChatMessagesProps {
  sendMessage: (
    options?:
      | MutationFunctionOptions<
          SendMessageToChatRoomMutation,
          Exact<{ input: CreateChatMessageInput }>
        >
      | undefined,
  ) => Promise<any>;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages = ({ sendMessage, scrollRef }: IChatMessagesProps) => {
  const { data: checkMeQuery } = useQuery(CHECK_ME);
  const userData = useFragment(CHECK_ME_FRAGMENT, checkMeQuery?.checkMe);
  const chatRoomId = Number(userData?.customer.activeChatRoom.id);
  const {
    data: queryData,
    error: messagesError,
    fetchMore: fetchMoreMessages,
    subscribeToMore: subscribeToMoreMessages,
  } = useSuspenseQuery(FETCH_MESSAGES, {
    variables: {
      chatRoomId,
      page: STARTING_PAGE,
      first: PAGE_SIZE,
    },
    returnPartialData: false,
  });
  const messages = queryData?.chatRoomMessages?.data || [];
  const { hasMorePages, currentPage } =
    queryData?.chatRoomMessages?.paginatorInfo || {};

  useEffect(() => {
    const terminateSubscription = subscribeToMoreMessages({
      document: SUBSCRIBE_TO_CHAT_ROOM,
      variables: {
        chatRoomId,
      },
      updateQuery: (messagesQuery, { subscriptionData }) => {
        const newMessage = subscriptionData.data.updateChatRoom;
        if (!newMessage) {
          return messagesQuery;
        }

        return {
          chatRoomMessages: {
            data: [...messagesQuery.chatRoomMessages.data, newMessage],
            paginatorInfo: messagesQuery.chatRoomMessages.paginatorInfo,
          },
        };
      },
    });

    return () => terminateSubscription();
  }, []);

  const fetchMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const intersectionObserverEntry = useIntersection(fetchMoreTriggerRef, {
    root: scrollRef?.current,
    threshold: 0.1,
  });
  const [isFetchingMore, startTransition] = useTransition();
  useEffect(() => {
    if (!hasMorePages || !scrollRef.current) {
      return;
    }

    if (
      intersectionObserverEntry?.isIntersecting &&
      currentPage &&
      !isFetchingMore
    ) {
      startTransition(() => {
        fetchMoreMessages({
          variables: {
            chatRoomId: chatRoomId,
            page: currentPage + 1,
            first: PAGE_SIZE,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }

            return {
              chatRoomMessages: {
                ...fetchMoreResult.chatRoomMessages,
                data: [
                  ...fetchMoreResult.chatRoomMessages.data,
                  ...prev.chatRoomMessages.data,
                ],
              },
            };
          },
        });
      });
    }
  }, [intersectionObserverEntry?.isIntersecting]);

  const [newPageOffset, setNewScrollOffset] = useState(0);
  useEffect(() => {
    const moreItemsFetched = !isFetchingMore;
    if (scrollRef.current && moreItemsFetched) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - newPageOffset;
      setNewScrollOffset(scrollRef.current.scrollHeight);
    }
  }, [isFetchingMore]);

  return (
    <div className={cn(`flex flex-col gap-2`)}>
      {/* Apollo client bug https://github.com/apollographql/apollo-client/issues/11315*/}
      {/*/!*TODO fix scrollbar flicker fetchMore result is rendered??*!/*/}
      {hasMorePages && (
        <div ref={fetchMoreTriggerRef}>
          <Icons.spinner className="animate-spin mx-auto" />
        </div>
      )}
      {messagesError && (
        <span className="text-red-500 text-xs mx-auto py-2">
          Uh-oh messages could not be loaded!
        </span>
      )}
      {messages.map((message, i) => {
        const messageData = useFragment(ChatMessageFragment, message);

        return (
          <ChatMessage
            key={messageData.id}
            message={messageData}
            resendMessage={sendMessage}
          />
        );
      })}
    </div>
  );
};

export default ChatMessages;
