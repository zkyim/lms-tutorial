import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import NavbarRoutes from "@/components/ui/navbar-routes";
import CourseMobileSidebar from "./_components/course-mobile-sidebar";


const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: {courseId: string}
}) => {
    const {userId} = auth();
    if (!userId) return redirect(`/`)

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        },
    });

    if (!course) return redirect(`/`);

    const progressCount = await getProgress(userId, course.id);
  return (
    <div className="h-full">
        <div className="h-[80px] w-full md:pl-80 fixed inset-y-0 z-50">
            <div className="p-4 border-b h-full flex items-center justify-end bg-white shadow-sm">
                <CourseMobileSidebar
                    course={course}
                    progressCount={progressCount}
                />
                <NavbarRoutes />
            </div>
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar
                course={course}
                progressCount={progressCount}
            />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
            {children}
        </main>
    </div>
  )
}

export default CourseLayout
