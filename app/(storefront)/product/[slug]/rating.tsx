// import { TiStarHalfOutline } from 'react-icons/ti';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
//
// export enum RATING_STYLES {
//   WITH_RATING = 'RATING',
//   WITH_REVIEWS = 'REVIEWS',
// }
//
// interface RatingProps {
//   starSize?: number;
//   className?: string;
//   style: RATING_STYLES;
//   reviewsCount: number;
//   totalRating: number;
// }
//
// interface StarsProps {
//   size: number;
// }
//
// export const Stars = ({ size }: StarsProps) => (
//   <div className="flex">
//     {Array(5)
//       .fill(null)
//       .map((_, index) => (
//         <TiStarHalfOutline key={index} size={size} />
//       ))}
//   </div>
// );
//TODO remove this
// const Rating = ({
//   starSize = 24,
//   className,
//   style,
//   reviewsCount,
//   totalRating,
// }: RatingProps) => {
//   return (
//     <div className={cn('flex items-center', className)}>
//       <div className="mr-2 flex">
//         {/*//TODO fix stars*/}
//         {Array(5)
//           .fill(null)
//           .map((_, index) => (
//             //TODO replace with different icons
//             <TiStarHalfOutline key={index} size={starSize} />
//           ))}
//       </div>
//       {style === RATING_STYLES.WITH_REVIEWS && (
//         <Link
//           href="/app/(storefront)/product/[slug]/reviews/reviews"
//           className="hover:text-blue-600 hover:underline"
//         >
//           ({reviewsCount} reviews)
//         </Link>
//       )}
//       {style === RATING_STYLES.WITH_RATING && (
//         <Link href="/app/(storefront)/product/[slug]/reviews/reviews">
//           ({totalRating})
//         </Link>
//       )}
//     </div>
//   );
// };
//
// export default Rating;
