'use client';

import { createContext, ReactNode, useReducer } from "react";
import { ChatMessage, User } from "@/gql/graphql";
import { createAction } from "@/lib/utils";

type ChatContextType = {
  messages: ChatMessage[],
  loadMessages: (messages: ChatMessage[]) => void,
  sendMessage: (message: ChatMessage) => void,
  receiveMessage: (message: ChatMessage) => void,
}

const INITIAL_STATE: ChatContextType = {
  messages: [],
  sendMessage: () => {},
  receiveMessage: () => {},
  loadMessages: () => {},
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
        messages: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [{ messages, receiveMessage, sendMessage }, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const initMessages = (messages: ChatMessage[]) => {
    dispatch(createAction(ChatActionTypes.LOAD_MESSAGES, messages));
  }

  const value = {
    messages,
    sendMessage,
    receiveMessage,
    loadMessages: initMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextProvider;
