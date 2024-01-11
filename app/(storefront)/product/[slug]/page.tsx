import Breadcrumb from "@/components/ui/common/breadcrumb";
import React from "react";
import ProductDetails from "@/(storefront)/product/product-details";
import MoreFromCreator from "@/(storefront)/product/more-from-creator";
import Reviews from "@/(storefront)/product/reviews";

export default function Page() {
  return (
    <div className='flex flex-col gap-2'>
      <Breadcrumb/>
      <ProductDetails />
      <MoreFromCreator />
      <Reviews />
    </div>
  );
}
