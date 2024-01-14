"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { cn } from "@/lib/utils";
import React, { forwardRef, memo } from "react";
import { Separator } from "@/components/ui/common/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatMessage as ChatMessageType } from "@/gql/graphql";

interface IChatMessageProps {
  message: ChatMessageType,
}

const ChatMessage =
  // memo(
  forwardRef<
    React.ElementRef<typeof Card>,
    React.ComponentPropsWithoutRef<typeof Card> & IChatMessageProps
  >((
  {
    message: { author, body, createdAt },
  }, ref
) => {
  const date = new Date(createdAt);

  return (
    <Card
      className={cn(
        "w-[40%]",
        author.role === "admin" ? "mr-auto" : "ml-auto"
      )}
      ref={ref}
    >
      <CardHeader className="px-2 pt-2 pb-1">
        <CardTitle className="text-xs">
          {author?.name}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent
        className="px-2 py-1 text-2xs min-h-[50px]"
      >
        {body}
      </CardContent>
      <Separator />
      <CardFooter className="px-2 py-0 text-foreground bg-lol">
        <TooltipProvider
          skipDelayDuration={1000}
        >
          <Tooltip
            delayDuration={300}
          >
            <TooltipTrigger
              className="text-3xs"
            >
              {new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric"
              }).format(date)}
            </TooltipTrigger>
            <TooltipContent
              className="text-3xs px-2 py-1"
            >
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
              }).format(date)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
});

export default ChatMessage;
