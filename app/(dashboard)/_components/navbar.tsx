
import React from 'react'
import MobileSidebar from './mobile-sidebar'
import NavbarRoutes from '@/components/ui/navbar-routes'
import { auth } from '@clerk/nextjs'

const Navbar = () => {
  const {userId} = auth();
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <MobileSidebar />
      <NavbarRoutes userId={userId}/>
    </div>
  )
}

export default Navbar
