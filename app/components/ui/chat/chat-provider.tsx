'use client';

import { createContext, ReactNode, useReducer } from "react";
import { ChatMessage, User } from "@/gql/graphql";
import { createAction } from "@/lib/utils";

type ChatContextType = {
  messages: ChatMessage[],
  messagesFetched: (messages: ChatMessage[]) => void,
  sendMessage: (message: ChatMessage) => void,
  receiveMessage: (oldMessages: ChatMessage[], message: ChatMessage) => void,
}

const INITIAL_STATE: ChatContextType = {
  messages: [],
  sendMessage: () => {},
  receiveMessage: () => {},
  messagesFetched: () => {},
};

export const ChatContext = createContext<ChatContextType>(INITIAL_STATE);

enum ChatActionTypes {
  LOAD_MESSAGES = 'LOAD_MESSAGES',
  SEND_MESSAGE = 'SEND_MESSAGE',
  RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
}

const chatReducer = (state: ChatContextType, action: Action) => {
  switch (action.type) {
    case ChatActionTypes.LOAD_MESSAGES:
      return {
        ...state,
        messages: [
          ...action.payload,
          ...state.messages,
        ],
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [{ messages, sendMessage }, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const addMessagesPage = (messages: ChatMessage[]) => {
    dispatch(createAction(ChatActionTypes.LOAD_MESSAGES, messages));
  }

  const receiveNewMessage = (oldMessages: ChatMessage[], message: ChatMessage) => {
    dispatch(createAction(ChatActionTypes.LOAD_MESSAGES, [...oldMessages, message]));
  };

  const value = {
    messages,
    messagesFetched: addMessagesPage,
    sendMessage,
    receiveMessage: receiveNewMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextProvider;
