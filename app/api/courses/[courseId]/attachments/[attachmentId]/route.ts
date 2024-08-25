import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params: {courseId: string, attachmentId: string}}
) {
    try {
        const {userId} = auth();

        if (!userId) {return new NextResponse("Unauthorized", {status: 401});}
        if (!params.courseId || params.courseId.length !== 24) return new NextResponse("ID OF COURSE ON URL", {status: 401})
            if (!params.attachmentId || params.attachmentId.length !== 24) return new NextResponse("ID OF ATTACHMENT ON URL", {status: 401})

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        })

        if (!courseOwner) {return new NextResponse("Unauthorized", {status: 401});}

        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            }
        });

        return NextResponse.json(attachment);
    }catch (err) {
        console.log("ATTACHMENT_ID", err);
        return new NextResponse("internal error", {status: 500});
    }
}