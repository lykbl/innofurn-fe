'use client';

import { Button } from '@/components/ui/common/button';
import { useKey, useToggle } from 'react-use';
import { BiMenu } from 'react-icons/bi';
import { IoIosArrowForward } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';

const categories = [
  'Shop By Department',
  'Programs & Promos',
  // ...Array(5).fill(null).map((_, index) => 'Test_' + index)
];
const subcategories = [
  'Beds',
  'Chairs',
  'Tables',
  // ...Array(20).fill('Accordion')
];

enum VARIANT_NAMES {
  OPEN = 'open',
  CLOSED = 'closed',
}

function SubcategoryButton({ subheader }: { subheader: string }) {
  return (
    <Button
      className="flex w-full justify-between px-4 py-2"
      onClick={() => {}}
    >
      <h4>{subheader}</h4>
      <IoIosArrowForward size={24} />
    </Button>
  );
}

export default function CategoriesMenu() {
  const [isOpen, toggle] = useToggle(false);
  useKey('Escape', () => toggle(false));

  return (
    <>
      <Button className="flex items-center" onClick={toggle}>
        <BiMenu size={24} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            animate={isOpen ? VARIANT_NAMES.OPEN : VARIANT_NAMES.CLOSED}
            className="absolute left-0 top-0 z-10 flex min-h-full w-full"
          >
            <motion.div
              initial={VARIANT_NAMES.CLOSED}
              animate={VARIANT_NAMES.OPEN}
              exit={VARIANT_NAMES.CLOSED}
              variants={{
                [VARIANT_NAMES.OPEN]: { transform: 'translateX(0%)' },
                [VARIANT_NAMES.CLOSED]: { transform: 'translateX(-100%)' },
              }}
              className="relative z-20 h-full min-h-screen w-2/12 bg-gray-50"
            >
              {categories.map((header) => (
                <div key={header} className="border-b-2 py-4">
                  <h3 className="px-4 py-2 font-bold">{header}</h3>
                  {subcategories.map(
                    (subheader, index) =>
                      index < 3 && (
                        <SubcategoryButton
                          key={subheader}
                          subheader={subheader}
                        />
                      ),
                  )}
                  {/*{subcategories.length > 3 && (*/}
                  {/*  // <Accordion>*/}
                  {/*  //   <Accordion.Toggle*/}
                  {/*  //     className="bg-gray-50 px-4 py-2 hover:outline"*/}
                  {/*  //     openClassName="outline sticky top-0 z-[1]"*/}
                  {/*  //   >*/}
                  {/*  //     <h4 className="mr-2">See All</h4>*/}
                  {/*  //   </Accordion.Toggle>*/}
                  {/*  //   <Accordion.Content>*/}
                  {/*  //     {subcategories.slice(3).map((subheader) => (*/}
                  {/*  //       <SubcategoryButton*/}
                  {/*  //         key={subheader}*/}
                  {/*  //         subheader={subheader}*/}
                  {/*  //       />*/}
                  {/*  //     ))}*/}
                  {/*  //   </Accordion.Content>*/}
                  {/*  // </Accordion>*/}
                  {/*)}*/}
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={VARIANT_NAMES.CLOSED}
              animate={VARIANT_NAMES.OPEN}
              exit={VARIANT_NAMES.CLOSED}
              variants={{
                [VARIANT_NAMES.OPEN]: { background: 'rgba(0,0,0,0.5)' },
                [VARIANT_NAMES.CLOSED]: { background: 'rgba(0,0,0,0.0)' },
              }}
              className="fixed left-0 top-0 h-full w-full cursor-pointer"
              onClick={toggle}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
