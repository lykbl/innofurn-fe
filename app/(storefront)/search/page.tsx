"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/common/card";
import { Button } from "@/components/ui/common/button";
import { FiHeart, FiPlusSquare } from "react-icons/fi";
import Image from "next/image";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { FiveStars, Star } from "@/components/rating/rating-breakdown";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/common/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/common/checkbox";

const colorClasses = [
  "bg-red-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-yellow-600",
  "bg-pink-600",
  "bg-purple-600",
  "bg-indigo-600",
  "bg-green-600",
  "bg-gray-600",
];

const Item = ({ index }: { index: number }) => {
  const rating = 4.5;
  const inStock = 15;
  const isFavorite = index === 0;
  const withLabel = index === 1;
  const onSale = index === 2;
  const price = 30.99;
  return (
    <Card>
      <CardHeader className="relative p-0 space-y-0">
        {withLabel && (
          <Badge className="bg-pink-600 absolute top-0 left-0">New</Badge>
        )}
        {onSale && (
          <Badge className="bg-emerald-600 absolute top-0 left-0">Sale</Badge>
        )}
        <Image
          className="rounded-t w-full"
          width={225}
          height={225}
          alt="Review imaeg"
          src="/sample-kitchen-image-2.jpg"
        />
      </CardHeader>
      <CardContent className="p-2 bg-muted">
        <RadioGroup
          loop
          defaultValue="test"
          className="flex justify-center py-2"
        >
          {colorClasses.map((colorClass, index) => (
            <RadioGroupItem
              key={index}
              className={colorClass}
              value={`radio-${index}`}
              id={`${colorClass}-radio`}
            />
          ))}
        </RadioGroup>
        <p>Description yo yo yo</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex py-1 items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 })
                    .fill(null)
                    .map((_, index) => (
                      <Star key={index} rating={rating} position={index + 1} />
                    ))}
                </div>
                (330)
              </div>
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          {onSale ? (
            <p className="text-xl">{price}$</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {Math.ceil(price * 0.8 * 100) / 100}$
              </span>
              <p className="text-xs line-through text-foreground/50">
                {price}$
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-2 flex justify-between items-stretch">
        <Badge className="text-xs">Leather</Badge>
        <div className="flex gap-1">
          <Button className="p-2 h-7 w-7">
            <Icons.heart className={cn(isFavorite ? "fill-white" : "")} />
          </Button>
          <Button className="p-2 h-7 w-7">
            <Icons.cart className="fill-primary" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default function Page() {
  // const [colorClasses, setColorClasses] = useState([
  //     "bg-red-600",
  //     "bg-emerald-600",
  //     "bg-blue-600",
  //     "bg-yellow-600",
  //     "bg-pink-600",
  //     "bg-purple-600",
  //     "bg-indigo-600",
  //     "bg-green-600",
  //     "bg-gray-600"
  // ]);

  return (
    <div className="flex gap-2 w-full pb-10">
      <div className="flex flex-col w-1/5 pr-4 gap-4">
        <Accordion type="multiple">
          <AccordionItem value="size">
            <AccordionTrigger>Size</AccordionTrigger>
            <AccordionContent>2x2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="color">
            <AccordionTrigger>Color</AccordionTrigger>
            <AccordionContent>
              <RadioGroup className="flex">
                {colorClasses.map((colorClass, index) => (
                  <RadioGroupItem
                    key={index}
                    className={colorClass}
                    value={`radio-${index}`}
                    id={`${colorClass}-radio`}
                  />
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="material">
            <AccordionTrigger>Material</AccordionTrigger>
            <AccordionContent>1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <FiveStars filledStars={4} /> & Up
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex items-center space-x-2">
          <Checkbox id="on-sale" />
          <label
            htmlFor="on-sale"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            On Sale
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="on-sale" />
          <label
            htmlFor="on-sale"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            On Sale
          </label>
        </div>
      </div>
      {/*<Separator orientation="vertical" />*/}
      <div className="flex flex-col gap-8 w-4/5 pl-4 border-l">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl">Results for: {"Search query"}</h1>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="avg_review">
                Average customer review
              </SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2">
          {Array.from({ length: 20 })
            .fill(null)
            .map((item, index) => (
              <Item key={index} index={index} />
            ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
