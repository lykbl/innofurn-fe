import { useFragment } from '@/gql/generated';
import ChatMessage from '@/components/chat/chat-message';
import * as React from 'react';
import {
  MutationFunctionOptions,
  useQuery,
  useSuspenseQuery,
} from '@apollo/client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useIntersection } from 'react-use';
import {
  CheckMeFragmentFragmentDoc,
  CreateChatMessageInput,
  Exact,
  SendMessageToChatRoomMutation,
} from '@/gql/generated/graphql';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { UpdateChatRoomSubscription } from '@/gql/subscriptions/chat';
import { FetchMessages } from '@/gql/queries/chat';
import { ChatMessageFragment } from '@/gql/fragments/chat';
import { CheckMeQuery } from '@/gql/queries/user';

const PAGE_SIZE = 3;
const STARTING_PAGE = 1;

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
  const { data: checkMeQuery } = useQuery(CheckMeQuery);
  const userData = useFragment(
    CheckMeFragmentFragmentDoc,
    checkMeQuery?.checkMe,
  );
  // const chatRoomId = Number(userData?.customer.activeChatRoom.id); TODO fix
  const chatRoomId = 0;
  const {
    data: queryData,
    error: messagesError,
    fetchMore: fetchMoreMessages,
    subscribeToMore: subscribeToMoreMessages,
  } = useSuspenseQuery(FetchMessages, {
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
      document: UpdateChatRoomSubscription,
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
          <Icons.spinner className="mx-auto animate-spin" />
        </div>
      )}
      {messagesError && (
        <span className="mx-auto py-2 text-xs text-red-500">
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
