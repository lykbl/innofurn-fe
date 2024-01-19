import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/common/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  makeVar, MutationFunctionOptions
} from "@apollo/client";
import {
  ChatMessageStatuses, CreateChatMessageInput, Exact, SendMessageToChatRoomMutation
} from "@/gql/graphql";
import { FragmentType, makeFragmentData, useFragment } from "@/gql";
import { ChatMessageFragment } from "@/components/ui/chat/chat-content";

const FormSchema = z.object({
  message: z.string().min(1, 'Message can not be empty.').max(300, 'Message can not be longer than 300 characters.'),
})

interface IChatMessageControlsProps {
  scrollRef: React.RefObject<HTMLDivElement>,
  sendMessage: (options?: MutationFunctionOptions<SendMessageToChatRoomMutation, Exact<{input: CreateChatMessageInput}>> | undefined) => Promise<any>,
  tempMessageId: number,
  setTempMessageId: React.Dispatch<React.SetStateAction<number>>,
}

const optimisticMessageVar = makeVar<FragmentType<typeof ChatMessageFragment> | null>(null);
const ChatMessageControls = ({ scrollRef, sendMessage, tempMessageId, setTempMessageId }: IChatMessageControlsProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })
  async function onSubmit(formInput: z.infer<typeof FormSchema>) {
    form.reset();
    await sendMessage({
      variables: {
        input: {
          body: formInput.message,
          chatRoomId: 2,
        }
      },
      optimisticResponse: {
        sendMessageToChatRoom: makeFragmentData({
          __typename: 'ChatMessage',
          id: `tmp${tempMessageId}`,
          body: formInput.message,
          createdAt: new Date(),
          status: ChatMessageStatuses.PENDING,
          author: {
            __typename: 'Customer',
            name: 'You', //TODO use actual name
            role: 'CUSTOMER',
          },
        }, ChatMessageFragment),
      },
      update: (cache, { data: newMessage, errors }) => {
        cache.modify({
          fields: {
            chatRoomMessages: (existingMessages = {}) => {
              const newMessageFragment = newMessage?.sendMessageToChatRoom;
              if (!newMessageFragment && !errors) {
                return existingMessages;
              }

              const fragmentData = errors ? optimisticMessageVar() : newMessageFragment;
              const newMessageData = useFragment(ChatMessageFragment, fragmentData);
              if (!errors && newMessageData) {
                optimisticMessageVar(
                  makeFragmentData({
                    ...newMessageData,
                    status: ChatMessageStatuses.ERROR,
                  }, ChatMessageFragment)
                );
              }

              return {
                data: [...existingMessages.data, newMessageData],
                paginatorInfo: existingMessages.paginatorInfo,
              };
            }
          }
        })
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
      },
    })
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
