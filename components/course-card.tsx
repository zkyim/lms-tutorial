import { IconBadge } from '@/components/icon-badge';
import { formatPrice } from '@/lib/format';
import { BookOpen, Image as ImageLucide } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import CourseProgress from './course-progress';
import { cn } from '@/lib/utils';

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
}

const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}> 
        <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 w-full'>
            <div className={cn('relative w-full aspect-video rounded-md overflow-hidden', !imageUrl && "bg-slate-300 animate-pulse flex items-center justify-center")}>
                {imageUrl ? (
                    <Image 
                        fill
                        className='object-cover'
                        alt={`image course`}
                        src={imageUrl}
                    />
                ) : <ImageLucide className='h-8 w-8' />}
            </div>
            <div className='flex flex-col pt-2'>
                <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>{title}</div>
                <p className='text-xs text-muted-foreground'>{category}</p>
                <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
                    <div className='flex items-center gap-x-1 text-slate-500'>
                        <IconBadge size={"sm"} icon={BookOpen}/>
                        <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
                    </div>
                </div>
                {progress !== null ? (
                    <CourseProgress 
                        variant={progress === 100 ? "success" : "default"}
                        size='sm'
                        value={progress}
                    />
                ): (
                    <p className='text-md md:text-sm font-medium text-slate-700'>
                        {formatPrice(price)}
                    </p>
                )}
            </div>
        </div>
    </Link>
  )
}

export default CourseCard
