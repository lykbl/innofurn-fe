import { gql } from '@/gql/generated';

export const SendMessageMutation = gql(/* GraphQL */ `
  mutation SendMessageToChatRoom($input: CreateChatMessageInput!) {
    sendMessageToChatRoom(input: $input) {
      ...ChatMessageFragment
    }
  }
`);
