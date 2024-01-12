'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BiChat } from "react-icons/bi";
import { Button } from "@/components/ui/common/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/common/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatMessage } from "@/gql/graphql";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  message: z.string().min(1, 'Message can not be empty.').max(300, 'Message can not be longer than 300 characters.'),
})

export default function Chat() {
  const DEFAULT_MESSAGES: ChatMessage[] = new Array(3).fill(0).map((_, i) => ({
    id: i,
    body: 'Hi nice to meet you!'.repeat(3),
    author: {
      name: i % 2 ? 'Admin' : 'You',
    },
    createdAt: new Date(),
  }));
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })
  function onSubmit(formInput: z.infer<typeof FormSchema>) {
      //TODO use optimistic update
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        body: formInput.message,
        author: {
          name: 'You',
        },
          createdAt: new Date()
        },
    ]);
    form.reset();
  }

  useEffect(() => {
    const addedMessage = messages[messages.length - 1];
    if (addedMessage?.author.name === 'You' && scrollRef.current) {
      const scrollViewPort = scrollRef.current?.getElementsByTagName('div')[0]; //TODO better way to do this:??
      scrollViewPort.scrollTop = scrollViewPort.scrollHeight;
    }
  }, [messages])

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="fixed right-16 bottom-16"
      >
        <Button variant="outline">
          <BiChat size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => {
          //prevent tooltip trigger
          e.preventDefault();
        }}
        align="end"
        side="top"
        asChild
      >
        <Card className="p-2 *:px-1 *:py-1 w-[400px]">
          <CardHeader className="py-2">
            <CardTitle>
              <p className="text-xl">
                Customer Chat
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="h-[33vh] rounded-md border p-4"
              ref={scrollRef}
            >
                <div className="flex flex-col gap-2">
                  {messages.map((message, i) => (
                    <ChatMessage
                      key={i}
                      author={message.author.name}
                      message={message.body}
                      date={message.createdAt}
                      position={message.author.name === 'Admin' ? 'left' : 'right'}
                    />
                  ))}
                </div>
              </ScrollArea>
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

interface IChatMessageProps {
  author: string;
  message: string;
  date: Date;
  position: 'left' | 'right';
}

const ChatMessage = memo(function ChatMessage({ author, message, date, position }: IChatMessageProps) {
  return (
    <Card className={cn(
      'w-[40%]',
      position === 'left' ? 'mr-auto' : 'ml-auto',
    )}>
      <CardHeader className="px-2 pt-2 pb-1">
        <CardTitle className="text-xs">
          {author}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent
        className='px-2 py-1 text-2xs min-h-[50px]'
      >
        {message}
      </CardContent>
      <Separator />
      <CardFooter className='px-2 py-0 text-foreground bg-lol'>
        <TooltipProvider
          skipDelayDuration={1000}
        >
          <Tooltip
            onOpenChange={(open) => console.log("open LOL?", open)}
            delayDuration={300}
          >
            <TooltipTrigger
              className="text-3xs"
            >
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              }).format(date)}
            </TooltipTrigger>
            <TooltipContent
              className="text-3xs px-2 py-1"
            >
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }).format(date)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
})
