import { gql } from '@/gql/generated';

export const FetchMessages = gql(/* GraphQL */ `
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
