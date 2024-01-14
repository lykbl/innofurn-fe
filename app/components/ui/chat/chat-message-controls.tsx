import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/common/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchResult, MutationFunctionOptions, MutationOptions, useMutation } from "@apollo/client";
import { gql } from "@/gql";
import { ChatContext } from "@/components/ui/chat/chat-provider";
import { useContext } from "react";

const FormSchema = z.object({
  message: z.string().min(1, 'Message can not be empty.').max(300, 'Message can not be longer than 300 characters.'),
})

const SEND_MESSAGE = gql(/* GraphQL */ `
    mutation SendMessageToChatRoom($input: CreateChatMessageInput!) {
        sendMessageToChatRoom(input: $input) {
            id
            body
            author {
                ... on Customer {
                    name
                    role
                }
                ... on Staff {
                    name
                    role
                }
            }
            createdAt
        }
    }
`);

const ChatMessageControls = () => {
  const { messages, receiveMessage } = useContext(ChatContext);
  const [sendMessageAsync, { loading: isMessageSending, error: messageSendFailed }] = useMutation(SEND_MESSAGE);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })

  async function onSubmit(formInput: z.infer<typeof FormSchema>) {
    const response = await sendMessageAsync({
      variables: {
        input: {
          body: formInput.message,
          chatRoomId: 2,
        }
      }
    });
    if (response.errors) {
      console.log(response.errors);
    }
    if (response.data?.sendMessageToChatRoom) {
      receiveMessage(messages, response.data.sendMessageToChatRoom);
      form.reset();
    }
    //TODO use optimistic update
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
