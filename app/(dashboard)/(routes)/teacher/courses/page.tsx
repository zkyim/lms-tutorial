import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'


const CoursesPage = async () => {
  const {userId} = auth();
  if (!userId) return redirect("/");

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAd: "desc",
    }
  });
  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
      {/* <Link href={"/teacher/create"}>
        <Button>
          New Course
        </Button>
      </Link> */}
    </div>
  )
}

export default CoursesPage
