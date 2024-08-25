import React from 'react'
import CourseSidebar from './course-sidebar'
import { Chapter, Course, UserProgress } from '@prisma/client';

interface CourseMobileSidebarHookProps {
    course: Course & {
        chapters : (Chapter & {
            userProgress: UserProgress[] | null,
        })[]
    };
    progressCount: number;
}

const CourseMobileSidebarHook = ( {
    course,
    progressCount
}: CourseMobileSidebarHookProps) => {
  return (
    <div>
      <CourseSidebar
        course={course}
        progressCount={progressCount}
      />
    </div>
  )
}

export default CourseMobileSidebarHook
