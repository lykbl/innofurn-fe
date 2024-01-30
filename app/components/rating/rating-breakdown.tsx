import { Card, CardContent, CardHeader } from "@/components/ui/common/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import React from "react";

interface IRatingBreakdownProps {
  rating: number;
  totalReviews: number;
}

export const Star = ({ isFilled, withGradient }) => {
  return (
    <Icons.star
      className={cn(
        "stroke-primary w-[16px] h-[16px]",
        isFilled ? "text-primary" : "text-white",
      )}
      withGradient={withGradient}
    />
  );
};

export const FiveStars = ({ filledStars }: { filledStars: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 })
        .fill(null)
        .map((_, index) => (
          <Star
            key={index}
            isFilled={index < filledStars}
            withGradient={false}
          />
        ))}
    </div>
  );
};

const RatingBreakdown = ({ rating, totalReviews }: IRatingBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <span>{rating} out of 5</span>
        <span>{totalReviews} ratings</span>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, index) => (
            <div key={index}>
              <Star rating={rating} position={index + 1} />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>5 star</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
