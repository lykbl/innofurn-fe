import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/common/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/common/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { MutationFunctionOptions } from "@apollo/client";
import {
  ChatMessageStatuses,
  CreateChatMessageInput,
  Exact,
  SendMessageToChatRoomMutation,
} from "@/gql/graphql";
import { FragmentType, makeFragmentData, useFragment } from "@/gql";
import { ChatMessageFragment } from "@/components/ui/chat/chat-content";

const FormSchema = z.object({
  message: z
    .string()
    .min(1, "Message can not be empty.")
    .max(300, "Message can not be longer than 300 characters."),
});
interface IChatMessageControlsProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  sendMessage: (
    options?:
      | MutationFunctionOptions<
          SendMessageToChatRoomMutation,
          Exact<{ input: CreateChatMessageInput }>
        >
      | undefined,
  ) => Promise<any>;
  isMessageSending: boolean;
  tempMessageId: number;
  setTempMessageId: React.Dispatch<React.SetStateAction<number>>;
}
const ChatMessageControls = ({
  scrollRef,
  sendMessage,
  tempMessageId,
  setTempMessageId,
  isMessageSending,
}: IChatMessageControlsProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });
  const optimisticMessageRef = useRef<FragmentType<
    typeof ChatMessageFragment
  > | null>(null);
  async function onSubmit(formInput: z.infer<typeof FormSchema>) {
    form.reset();
    await sendMessage({
      variables: {
        input: {
          body: formInput.message,
        },
      },
      optimisticResponse: {
        sendMessageToChatRoom: makeFragmentData(
          {
            __typename: "ChatMessage",
            id: `tmp${tempMessageId}`,
            body: formInput.message,
            createdAt: new Date(),
            status: ChatMessageStatuses.PENDING,
            author: {
              __typename: "Customer",
              name: "You", //TODO use actual name
              role: "CUSTOMER",
            },
          },
          ChatMessageFragment,
        ),
      },
      update: (cache, { data: newMessage, errors }) => {
        cache.modify({
          fields: {
            chatRoomMessages: (existingMessages = {}) => {
              const newMessageFragment = newMessage?.sendMessageToChatRoom;
              if (!newMessageFragment && !errors) {
                return existingMessages;
              }

              const fragmentData = errors
                ? optimisticMessageRef.current
                : newMessageFragment;
              const newMessageData = useFragment(
                ChatMessageFragment,
                fragmentData,
              );
              if (!errors && newMessageData) {
                optimisticMessageRef.current = makeFragmentData(
                  {
                    ...newMessageData,
                    status: ChatMessageStatuses.ERROR,
                  },
                  ChatMessageFragment,
                ); // TODO Add immer or smth?
              }

              return {
                data: [...existingMessages.data, newMessageData],
                paginatorInfo: existingMessages.paginatorInfo,
              };
            },
          },
        });
      },
    });
  }

  useEffect(() => {
    if (isMessageSending && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isMessageSending]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
          setTempMessageId((prev: number) => prev + 1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
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
        <Button variant="outline" type="submit">
          Send Message
          <span className="ml-auto text-xs tracking-widest opacity-60">
            ⌘+↵
          </span>
        </Button>
      </form>
    </Form>
  );
};

export default ChatMessageControls;
