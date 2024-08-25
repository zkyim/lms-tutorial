"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Course } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "@/components/file-upload"

const formSchema = z.object({
    imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
})

interface DescriptionProps {
    initialData: Course;
    courseId: String;
}

const ImageForm: React.FC<DescriptionProps> = ({
    initialData,
    courseId
}) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated.");
            toggleEdit();
            router.refresh();
        }catch {
            toast.error("Something went wrong.")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit Image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&  (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image 
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
                
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endepoint="courseImage"
                        onChange={(url) => {
                            console.log("[URL_HERE]"+url);
                            if (url) {
                                onSubmit({imageUrl: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
      )
}

export default ImageForm
