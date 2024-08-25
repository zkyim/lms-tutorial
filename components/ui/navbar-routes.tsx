"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from '../search-input'
import { auth } from '@clerk/nextjs/server'
import { isTeacher } from '@/lib/teacher'

const NavbarRoutes = () => {
    const {userId} = auth();
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

  return (
    <>
        {isSearchPage && (
            <div className='hidden md:block'>
                <SearchInput />
            </div>
        )}
        <div className='flex gap-x-2 ml-auto'>
            {isTeacherPage || isCoursePage ? (
                <Link href={"/"}>
                    <Button size="sm" variant="ghost">
                        <LogOut className='h-4 w-4 mr-2'/>
                        Exit
                    </Button>
                </Link>
            ) : isTeacher(userId) ? (
                <Link href={"/teacher/courses"}>
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
            ) : null}
            <UserButton 
                afterSignOutUrl='/'
            />
        </div>
    </>
  )
}

export default NavbarRoutes
