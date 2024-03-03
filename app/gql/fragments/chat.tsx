import { gql } from '@/gql/generated';

export const ChatMessageFragment = gql(/* GraphQL */ `
  fragment ChatMessageFragment on ChatMessage {
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
`);

export const ActiveChatRoomFragment = gql(/* GraphQL */ `
  fragment ActiveChatRoomFragment on ChatRoom {
    id
    messages {
      ...ChatMessageFragment
    }
  }
`);
