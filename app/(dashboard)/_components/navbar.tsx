
import React from 'react'
import MobileSidebar from './mobile-sidebar'
import NavbarRoutes from '@/components/ui/navbar-routes'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

const Navbar = () => {
  const {userId} = auth();
  if (!userId) return redirect("/");
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <MobileSidebar />
      <NavbarRoutes userId={userId}/>
    </div>
  )
}

export default Navbar
