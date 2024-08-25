import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const handelAuth = () => {
    const {userId} = auth();
    const isAuthorized = isTeacher(userId);

    if (!userId || !isAuthorized) throw new UploadThingError("Unarhorized");
    return {userId};
}
 
export const ourFileRouter = {
    courseImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
        .middleware(() => handelAuth())
        .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(()=> handelAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({video: {maxFileCount: 1, maxFileSize: "512GB"}})
        .middleware(()=> handelAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;