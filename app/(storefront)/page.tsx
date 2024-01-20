"use client";

import { gql } from "@/gql";
import { useQuery } from "@apollo/client";
import BaseLink from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/components/contexts/auth-context";

const REVIEWS_QUERY = gql(/* GraphQL */ `
  query UserReviews {
    getUserReviews {
      id
      title
      body
    }
  }
`);

export default function Page() {
  const { user } = useContext(AuthContext);
  const { loading: isLoading, data } = useQuery(REVIEWS_QUERY);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || !data.getUserReviews) {
    return <p>No data!!</p>;
  }

  return (
    <>
      Main page
      {user && <p>Hello there {user.name}!</p>}
      <BaseLink href="/product/test">Product page</BaseLink>
      <div>
        Reviews:
        <div className="flex flex-col">
          {data.getUserReviews.map((review: any) => (
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
