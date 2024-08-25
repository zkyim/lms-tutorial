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
            }
        });

        if (!course) return new NextResponse("Course Not Found", {status: 404});

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
            },
            data: {
                isPublished: false,
            }
        })
        return NextResponse.json(unpublishedCourse)
    }catch (err) {
        console.log("COURSE_ID_UNPUBLISH", err);
        return new NextResponse("Internal server error", {status: 500});
    }
}