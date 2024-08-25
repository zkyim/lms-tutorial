import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (
    req: Request,
    {params} : {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        const {url} = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unuthorized", {status: 401})
        }
        if (!params.courseId || params.courseId.length !== 24) return new NextResponse("ID OF COURSE ON URL", {status: 401})

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unuthorized", {status: 401})
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId,
            }
        })
        return NextResponse.json(attachment);
    }catch (err) {
        console.log("[COURSE_ID_ATTACHMENTS", err);
        return new NextResponse("Internal server", {status: 500});
    }
}