import { Button } from '@/components/ui/common/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/common/form';
import React, { MouseEventHandler, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import {
  CheckMeFragmentFragmentDoc,
  ProductReviewVariantFragmentFragment,
} from '@/gql/generated/graphql';
import VariantsInput from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/variants-input';
import RatingInput from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/rating-input';
import TitleInput from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/title-input';
import BodyInput from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/body-input';
import { CheckMeQuery } from '@/gql/queries/user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { CreateReviewMutation } from '@/gql/mutations/review';

const LeaveReviewFormSchema = z.object({
  productVariantId: z.number().int(),
  title: z.string().max(255),
  body: z.string().max(65535),
  rating: z.number().int().min(1).max(5),
});

export default function LeaveReview({
  productVariants,
}: {
  productVariants: Array<ProductReviewVariantFragmentFragment>;
}) {
  const { toast } = useToast();
  const [createReview] = useMutation(CreateReviewMutation, {
    onCompleted: () => {
      toast({
        duration: 2000,
        type: 'foreground',
        title: 'Success',
        description: 'Thank you! Your review was submitted.',
        variant: 'success',
      });
    },
    onError: (error) => {
      return toast({
        duration: 2000,
        type: 'foreground',
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  const [reviewableVariant, setReviewableVariant] =
    useState<ProductReviewVariantFragmentFragment>(productVariants[0]);
  const form = useForm<z.infer<typeof LeaveReviewFormSchema>>({
    resolver: zodResolver(LeaveReviewFormSchema),
    defaultValues: {
      productVariantId: reviewableVariant.id,
      title: '',
      body: '',
      rating: 0,
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await createReview({
        variables: {
          input: {
            productVariantId: reviewableVariant.id,
            title: values.title,
            body: values.body,
            rating: values.rating,
          },
        },
      });
    });
  });

  const { data: checkMeQuery } = useQuery(CheckMeQuery);
  const user =
    checkMeQuery?.checkMe &&
    useFragment(CheckMeFragmentFragmentDoc, checkMeQuery.checkMe);
  const router = useRouter();
  const handleOpenLeaveReviewForm: MouseEventHandler = (e) => {
    if (user == null) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="py-1" onClick={handleOpenLeaveReviewForm}>
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-[80%] flex-col gap-2">
        <h1 className="text-xl">Your review for {reviewableVariant.name}</h1>
        <div className="space-y-1 text-xs">
          <p className="font-semibold">
            Tell us about your impressions in detail
          </p>
          <p>
            Why did you decide to buy this product? What did you especially like
            and didn't like?
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className={cn('flex flex-col gap-2', isPending && 'animate-pulse')}
          >
            <div className="flex gap-2">
              <VariantsInput variants={productVariants} />
              <RatingInput />
            </div>
            <TitleInput />
            <BodyInput />
            {/* TODO add this */}
            {/*<ProsNConsInput />*/}
            <Button type="submit" className="w-full" disabled={user === null}>
              Submit review
            </Button>
          </form>
        </Form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
