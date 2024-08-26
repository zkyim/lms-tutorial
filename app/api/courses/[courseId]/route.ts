import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"
import { isTeacher } from "@/lib/teacher";
import { UTApi } from "uploadthing/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export async function DELETE(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        const {courseId} = params;

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthrized", {status: 401})
        if (!courseId || courseId.length !== 24 ) return new NextResponse("Course Id", {status: 401})

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }

        })

        if (!course) return new NextResponse("Course not found", {status: 404})
        
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                // await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }


        // error in the Library
        // if (course.imageUrl) {
        //     const imageKey: string = course.imageUrl.substring(course.imageUrl.lastIndexOf('/') + 1);
        //     await UTApi.prototype.deleteFiles([imageKey]);
        // }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId
            }
        });

        return NextResponse.json(deletedCourse);
    }catch (e) {
        console.log("[COURSE_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthrized", {status: 401})
        }
        if (!courseId || courseId.length !== 24) {
            return new NextResponse("Course Id", {status: 401})
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });
        return NextResponse.json(course);
    }catch (e) {
        console.log("[COURSE ID]", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}