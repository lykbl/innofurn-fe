import { gql } from '@/gql/generated';

export const UpdateChatRoomSubscription = gql(/* GraphQL */ `
  subscription SubscribeToChatRoom($chatRoomId: IntID!) {
    updateChatRoom(chatRoomId: $chatRoomId) {
      ...ChatMessageFragment
    }
  }
`);
