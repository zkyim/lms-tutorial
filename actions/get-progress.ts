import { db } from '@/lib/db';
import React from 'react'

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
            select: {
                id: true,
            }
        });

        const publishedChapterIds = publishedChapters.map(chapter => chapter.id);
        const validCopletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true
            }
        });

        const progressPercentage = (validCopletedChapters/publishedChapterIds.length) * 100;

        return progressPercentage;
    }catch (err) {
        console.log("[GET_PROGRESS]",err);
        return 0;
    }
}

