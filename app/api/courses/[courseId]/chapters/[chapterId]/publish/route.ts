import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string; chapterId: string;}}
) {
    try {
        const {userId} = auth();
        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        if (!params.courseId || params.courseId.length !== 24) return new NextResponse("Course ID Not Found", {status: 401});
        if (!params.chapterId || params.chapterId.length !== 24) return new NextResponse("Course ID Not Found", {status: 401});

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
            }
        });

        if (!ownCourse) return new NextResponse("Unauthorized", {status: 401});

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            },
        });

        if (!chapter || !chapter.title || !chapter.description) return new NextResponse("Missing required fielsd", {status: 400});

        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedChapter);
    }catch (e) {
        console.log("[CHAPTER_PUBLISH", e);
        return new NextResponse("Internal server error", {status: 500});
    }
}