'use client';

import { ROUTES } from '@/lib/constants/routes';
import { useClerk, useUser } from '@clerk/nextjs';
import { Languages, LogOut, Settings, UserRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const dropdownMenuItemClass =
  'gap-8 !px-6 !pr-16 !py-4 cursor-pointer border-top';

export function AccountMenu() {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-2 h-fit cursor-pointer">
          <UserRound className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="text-muted-foreground font-semibold min-w-10 p-0 "
      >
        <DropdownMenuLabel
          className={`${dropdownMenuItemClass} flex items-center`}
        >
          <UserRound className="text-foreground" />
          <div className="flex flex-col">
            <span className="text-foreground">{user?.fullName}</span>
            <span className="font-normal text-sm">{user?.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem className={dropdownMenuItemClass}>
          <Link
            href={ROUTES.ACCOUNT}
            aria-label="Account"
            className="h-fit w-full flex items-center gap-8"
          >
            <Languages />
            Languages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className={dropdownMenuItemClass}
          onClick={() => openUserProfile()}
        >
          <Settings />
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className={dropdownMenuItemClass}
          onClick={() => signOut()}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
