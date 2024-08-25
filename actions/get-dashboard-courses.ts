import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    completedCourses: any[];
    coursesInProgress: any[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purcheasedCourses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        })

        const courses = purcheasedCourses.map(purcheas => purcheas.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100 );

        return {
            completedCourses,
            coursesInProgress
        }
    }catch (err) {
        console.log("[GET_DASHBOARD_COURSES", err);
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }
}