import Mux from "@mux/mux-node"

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE (
    req: Request,
    {params}: {params: {courseId: string; chapterId: string;}}
) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;

        if (!userId) {
            return new NextResponse("Unauthrized userId", {status: 401})
        }

        if (!courseId || courseId.length !== 24) return new NextResponse("ID OF COURSE ON URL", {status: 401})
        if (!chapterId || chapterId.length !== 24) return new NextResponse("ID OF CHAPTER ON URL", {status: 401})

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!ownCourse) return new NextResponse("Unauthrized Course Not Found", {status: 401})

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        })

        if (!chapter) return new NextResponse("Unauthrized Chapter Not Found", {status: 404})

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                },
            });
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false
                }
            })
        } 
        
        return NextResponse.json(deletedChapter);
    }catch (e) {
        console.log("[COURSE_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string; chapterId: string;}}
) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;
        const {isPublished , ...values} = await req.json();
        if (!userId) {
            return new NextResponse("Unauthrized", {status: 401})
        }

        if (!courseId || courseId.length !== 24) return new NextResponse("ID OF COURSE ON URL", {status: 401})
        if (!chapterId || chapterId.length !== 24) return new NextResponse("ID OF CHAPTER ON URL", {status: 401})

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!ownCourse) return new NextResponse("Unauthrized", {status: 401})

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            })

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                })
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false
            })

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }
        
        return NextResponse.json(chapter);
    }catch (e) {
        console.log("[COURSE_CHAPTER_ID]", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}