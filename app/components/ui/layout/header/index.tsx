import { HeaderLogo } from '@/components/logo';
import { Button, BUTTON_STYLES } from '@/components/ui/common/button';
import Link from "@/components/ui/common/link";
import {
  BiSearchAlt,
  BiShoppingBag,
  BiUser,
} from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import BasicInput from '@/components/ui/common/input';
import BaseLink from "next/link";
import ROUTES from "@/lib/routes";
import AuthControls from "@/components/ui/layout/header/auth-controls";
import SearchBar from "@/components/ui/layout/header/search-bar";

export default async function Header() {
  return (
    <div className='border-b-2'>
      <div className='flex justify-between max-w-screen-2xl mx-auto py-2 px-2 items-center'>
        <div className='flex items-center w-1/5'>
          <Link href='/' className='p-2 rounded border-transparent border hover:border-black'>
            <HeaderLogo />
          </Link>
        </div>
        <div className='flex items-center justify-between rounded border-black border-2 w-3/5 h-min'>
          <SearchBar />
        </div>
        <div className='flex items-center w-1/5 justify-end'>
          <AuthControls />
        </div>
      </div>
    </div>
  );
}
