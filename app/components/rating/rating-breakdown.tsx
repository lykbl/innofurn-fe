//TODO add breakdown
//
// type FiveStarsProps = {
//   filledStars: number;
//   onMouseOver: (index: number) => void | null;
//   onMouseLeave: () => void | null;
//   onClick: (index: number) => void | null;
// };
// export const FiveStars = ({
//   filledStars,
//   onMouseOver,
//   onMouseLeave,
//   onClick,
// }: FiveStarsProps) => {
//   return (
//     <div className="flex items-center gap-1" onMouseLeave={onMouseLeave}>
//       {Array.from({ length: 5 })
//         .fill(null)
//         .map((_, index) => (
//           <Star
//             key={index}
//             isFilled={index < filledStars}
//             withGradient={false}
//             onMouseOver={() => onMouseOver(index)}
//             onClick={() => onClick(index)}
//           />
//         ))}
//     </div>
//   );
// };
