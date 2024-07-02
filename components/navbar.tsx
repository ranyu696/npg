import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { link as linkStyles } from '@nextui-org/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { FaHome } from 'react-icons/fa';
import Image from 'next/image';
import { headers } from 'next/headers';

import { ThemeSwitch } from '@/components/theme-switch';
import SearchForm from '@/components/SearchForm';
import { Category } from '@/types';

import NavMenu from './NavMenu';
import FavoriteButton from './FavoriteButton';

// 定义 categories 的 TypeScript 接口

interface NavbarProps {
  categories: Category[];
}
export const Navbar: React.FC<NavbarProps> = ({ categories }) => {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-default text-default-foreground rounded-small">
              <Image
                alt="avatar"
                className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                data-loaded="true"
                height={192}
                src="/icon-192x192.png"
                width={192}
              />
            </span>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {categories.map((category) => (
            <NavbarItem key={category.id}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                href={`/category/${category.attributes.slug}`}
              >
                {category.attributes.name}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <SearchForm />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <FavoriteButton userAgent={userAgent} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Button isIconOnly color="primary">
          <FaHome />
        </Button>
        <FavoriteButton userAgent={userAgent} />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <NavMenu categories={categories} />
    </NextUINavbar>
  );
};
