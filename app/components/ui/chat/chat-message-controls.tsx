import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/common/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import {
  Chat_Message_Statuses,
  CreateChatMessageInput, Exact,
  MutationSendMessageToChatRoomArgs,
  SendMessageToChatRoomMutation
} from "@/gql/graphql";
import { BaseMutationOptions, makeVar, MutationFunction, MutationFunctionOptions } from "@apollo/client";

const FormSchema = z.object({
  message: z.string().min(1, 'Message can not be empty.').max(300, 'Message can not be longer than 300 characters.'),
})

interface IChatMessageControlsProps {
  scrollRef: React.MutableRefObject<HTMLDivElement>,
  sendMessage: MutationFunction,
  tempMessageId: number,
  setTempMessageId: React.Dispatch<React.SetStateAction<number>>,
}

const optimisticMessageVar = makeVar(null);
const ChatMessageControls = ({ scrollRef, sendMessage, tempMessageId, setTempMessageId }: IChatMessageControlsProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })
  async function onSubmit(formInput: z.infer<typeof FormSchema>) {
    sendMessage({
      variables: {
        input: {
          body: formInput.message,
          chatRoomId: 2,
        }
      },
      optimisticResponse: {
        sendMessageToChatRoom: {
          id: `tmp${tempMessageId}`,
          __typename: 'ChatMessage',
          body: formInput.message,
          createdAt: new Date().toISOString(),
          status: 'PENDING',
          author: {
            __typename: 'Customer',
            name: 'You',
            role: 'CUSTOMER',
          },
        }
      },
      update: (cache, { data: newMessage, errors }) => {
        if (!newMessage?.sendMessageToChatRoom && !errors) {
          return;
        }
        cache.modify({
          fields: {
            chatRoomMessages: (existingMessages = {}) => {
              let newMessageData = newMessage?.sendMessageToChatRoom ?? optimisticMessageVar();
              if (!errors) {
                optimisticMessageVar({
                  ...newMessage.sendMessageToChatRoom,
                  status: Chat_Message_Statuses.Error,
                });
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
    })
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
          setTempMessageId((prev: number) => prev + 1);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            form.handleSubmit(onSubmit)();
          }
        }}
        className="grid w-full gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type your message here."
                  className="resize-none"
                  maxLength={300}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          type="submit"
        >
          Send Message
          <span className="ml-auto text-xs tracking-widest opacity-60">⌘+↵</span>
        </Button>
      </form>
    </Form>
  );
}

export default ChatMessageControls;
