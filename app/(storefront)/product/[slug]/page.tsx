import Breadcrumb from "@/ui/common/breadcrumb";
import React from "react";
import ProductDetails from "@/ui/storefront/product/product-details";
import MoreFromCreator from "@/ui/storefront/product/more-from-creator";
import Reviews from "@/ui/storefront/product/reviews";

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
