'use client';

import { useQuery } from '@apollo/client';
import BaseLink from 'next/link';
import { UserReviewsQuery } from '@/gql/queries/product';

export default function Page() {
  const { loading: isLoading, data } = useQuery(UserReviewsQuery);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || !data.userReviews) {
    return <p>No data!!</p>;
  }

  return (
    <>
      Main page
      {/*{user && <p>Hello there {user.name}!</p>}*/}
      <BaseLink href="/product/adde">Product page</BaseLink>
      <div>
        Reviews:
        <div className="flex flex-col">
          {data.userReviews.map((review: any) => (
            <div key={review.id}>
              <h2>Title: {review.title}</h2>
              <p>Body: {review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
