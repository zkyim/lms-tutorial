
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';
import CourseSidebar from './course-sidebar';
import CourseSidebarItem from './course-sidebar-item';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

interface CourseMobileSidebarProps {
    course: Course & {
        chapters : (Chapter & {
            userProgress: UserProgress[] | null,
        })[]
    };
    progressCount: number;
}

const CourseMobileSidebar = async ({
    course,
    progressCount
}: CourseMobileSidebarProps) => {
    const {userId} = auth();
    if (!userId) return redirect("/");
    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            }
        }
    }); 
  return (
    <Sheet>
        <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
            <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className='p-0 bg-white w-72'>
            <CourseSidebar
                course={course}
                progressCount={progressCount}
            />

        {course.chapters.map(chapter => (
                <CourseSidebarItem
                    key={chapter.id}
                    id={chapter.id}
                    lable={chapter.title}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    courseId={course.id}
                    isLocked={!chapter.isFree && !purchase}
                />
            ))}

        </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar
