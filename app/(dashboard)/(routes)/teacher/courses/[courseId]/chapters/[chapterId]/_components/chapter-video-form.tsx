"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import MuxPlayer from "@mux/mux-player-react"

import { Button } from "@/components/ui/button"
import { PlusCircle, Video } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Chapter, MuxData } from "@prisma/client"
import { FileUpload } from "@/components/file-upload"

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null};
    courseId: String;
    chapterId: String;
}

const ChapterVideoForm: React.FC<ChapterVideoFormProps> = ({
    initialData,
    courseId,
    chapterId
}) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: initialData?.videoUrl || ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated.");
            toggleEdit();
            router.refresh();
        }catch {
            toast.error("Something went wrong.")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Video className="h-4 w-4 mr-2"/>
                            Edit Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&  (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
                
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endepoint="chapterVideo"
                        onChange={(url) => {
                            console.log("[URL_HERE]"+url);
                            if (url) {
                                onSubmit({videoUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s videw
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
      )
}

export default ChapterVideoForm
