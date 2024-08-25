"use client";
import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/se-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const confitte = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/`);
            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
        }catch (error) {
            toast.error("Something went wrong")
        }finally {
            setIsLoading(false);
        }
    }

    const onclick = async () => {
        try {
            setIsLoading(true);
            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublished`);
                toast.success("Course unpublished");
            }else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published");
                confitte.onOpen();
            }
            router.refresh();
        }catch (error) {
            toast.error("Something went wrong")
        }finally {
            setIsLoading(false);
        }
    }
  return (
    <div className='flex items-center gap-x-2'>
        <Button
            onClick={onclick}
            disabled={disabled || isLoading}
            variant={"outline"}
            size={"sm"}
        >
            {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <ConfirmModal
            onCofirm={onDelete}
        >
            <Button size={"sm"}>
                <Trash className='h-4 w-4'/>
            </Button>   
        </ConfirmModal>
    </div>
  )
}

export default Actions
