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

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });

        if (!publishedChapterInCourse) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            })
        }

        return NextResponse.json(unpublishedChapter);
    }catch (e) {
        console.log("[CHAPTER_UNPUBLISH", e);
        return new NextResponse("Internal server error", {status: 500});
    }
}