import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params} : {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401});
        if (!params.courseId || params.courseId.length !== 24) return new NextResponse("ID OF COURSE ON URL", {status: 401})

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!courseOwner) return new NextResponse("Unauthorized", {status: 401});

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc"
            },
        });
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition
            }
        })
        return NextResponse.json(chapter);
    }catch (e) {
        console.log("[CHAPTERS]", e);
        return new NextResponse("Internal server error", {status: 500})
    }
}