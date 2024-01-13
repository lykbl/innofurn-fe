import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/common/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  message: z.string().min(1, 'Message can not be empty.').max(300, 'Message can not be longer than 300 characters.'),
})

const ChatMessageControls = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })
  function onSubmit(formInput: z.infer<typeof FormSchema>) {
    //TODO use optimistic update
    // setMessages((oldMessages) => [
    //   ...oldMessages,
    //   {
    //     body: formInput.message,
    //     author: {
    //       name: 'You',
    //     },
    //     createdAt: new Date()
    //   },
    // ]);
    form.reset();
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
