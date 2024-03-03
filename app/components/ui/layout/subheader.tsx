import { Button } from '@/components/ui/common/button';
import CategoriesMenu from '@/components/ui/layout/categories-menu';
import { ReactNode } from 'react';

const promotions = [
  {
    id: 1,
    name: 'Ongoing Promotions',
    link: '/cat/furniture',
  },
  {
    id: 2,
    name: 'Work With Us',
    link: '/cat/kitchen',
  },
  {
    id: 3,
    name: 'Room Planner',
    link: '/room-planner',
  },
];

export default function Subheader(): ReactNode {
  return (
    <div className="border-b-2">
      <div className="mx-auto flex max-w-screen-2xl justify-between gap-2 px-2 py-2">
        <div className="flex items-center">
          <CategoriesMenu />
          {promotions.map((promotion) => (
            <div key={promotion.id}>
              <Button className="mx-2 font-medium">{promotion.name}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
