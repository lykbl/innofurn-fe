import { Button } from '@/components/ui/common/button';
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

const MediaIcons = [
  <FaFacebook size={20} />,
  <FaInstagram size={20} />,
  <FaTiktok size={20} />,
  <FaYoutube size={20} />,
];

const IntegratedPaymentsIcons = [
  <FaCcVisa size={20} />,
  <FaCcMastercard size={20} />,
  <FaCcAmex size={20} />,
];

const Footer = () => (
  <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-16 text-sm font-medium text-neutral-700">
    <div className="flex w-full justify-between">
      <div className="mr-6 flex w-1/5 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="mb-4 text-base font-semibold text-black">
            Join InnoFurn Family
          </p>
          <p>
            Bring your ideas to life with special discounts, inspiration and
            lots of good things in store. It's all free.
          </p>
          <Button className="w-max px-4">Join or log in</Button>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-4 text-base font-semibold text-black">
            We support you
          </p>
          <p>
            You can do all by yourself or get help from us. Our services make
            your life easier.
          </p>
          <Button className="w-max px-4">Go to customer service</Button>
        </div>
      </div>
      <div className="flex w-1/5 flex-col gap-4">
        <p className="font-semibold text-black">Shop & plan</p>
        <div className="mt-2 flex flex-col gap-4">
          <p>Locations</p>
          <p>All InnoFurn products</p>
          <p>Offers</p>
          <p>Planners</p>
          <p>Planning consultation</p>
          <p>Swedish restaurant & food (German)</p>
          <p>Give us your feedback</p>
        </div>
      </div>
      <div className="flex w-1/5 flex-col gap-4">
        <p className="font-semibold text-black">Services</p>
        <div className="mt-2 flex flex-col gap-4">
          <p>Delivery</p>
          <p>Click & collect</p>
          <p>Rental</p>
          <p>Assembly</p>
          <p>Removal & recycling</p>
          <p>Repair & Longer Life</p>
          <p>Finance options</p>
          <p>Guarantee (German)</p>
        </div>
      </div>
      <div className="flex w-1/5 flex-col gap-4">
        <p className="font-semibold text-black">Help & support</p>
        <div className="mt-2 flex flex-col gap-4">
          <p>Services</p>
          <p>Purchase history</p>
          <p>Track my order</p>
          <p>Cancel my order</p>
          <p>Change delivery details</p>
          <p>Return & claims</p>
          <p>Express return</p>
          <p>Help & contact</p>
        </div>
      </div>
      <div className="flex w-1/5 flex-col gap-4">
        <p className="font-semibold text-black">About InnoFurn</p>
        <div className="mt-2 flex flex-col gap-4">
          <p>InnoFurn Family</p>
          <p>InnoFurn for Business</p>
          <p>This is InnoFurn</p>
          <p>Jobs & career</p>
          <p>Newsroom (German)</p>
          <p>Product recalls</p>
          <p>InnoFurn apps</p>
          <p>InnoFurn terms & conditions</p>
        </div>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="flex justify-between gap-4">
        {[...MediaIcons, ...IntegratedPaymentsIcons].map((icon, i) => (
          <div
            key={i}
            className="flex items-center rounded-full border border-neutral-300 bg-white p-2 hover:border-neutral-500"
          >
            {icon}
          </div>
        ))}
      </div>
      <div className="flex">
        <Button className="flex items-center gap-2">
          <span>English</span>
          <IoIosArrowDown size={24} />
        </Button>
      </div>
    </div>
  </div>
);

export default Footer;
