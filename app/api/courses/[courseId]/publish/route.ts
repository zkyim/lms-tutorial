import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        if (!userId) return new NextResponse("Unauthorized User", {status: 401});
        if (!params.courseId || params.courseId.length !== 24) return new NextResponse("Course Id Not found", {status: 401});

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) return new NextResponse("Course Not Found", {status: 404});

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !hasPublishedChapter || !course.categoryId) return new NextResponse("Missing Required Fields", {status: 401});

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
            },
            data: {
                isPublished: true,
            }
        })
        return NextResponse.json(publishedCourse)
    }catch (err) {
        console.log("COURSE_ID_PUBLISH", err);
        return new NextResponse("Internal server error", {status: 500});
    }
}