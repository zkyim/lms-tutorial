import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import {getProgress} from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null;
}

type GetCoursesProps = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCoursesProps): Promise<CourseWithProgressWithCategory[]>=> {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAd: "desc"
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    };
                }
                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                };
            })
        );

        
        return coursesWithProgress;
    }catch (err) {
        console.log("GET_COURSE",err);
        return [];
    }
}