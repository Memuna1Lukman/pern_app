import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ClassDetails } from '@/types'

import { useShow } from '@refinedev/core'
import React from 'react'

const ClassesShow = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' })
    const classDetails = query.data?.data;

    const { isLoading, isError } = query
    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className='class-view class-show'>
                <ShowViewHeader resource='classes' title='Class Details' />
                <p className={`state-message${isError ? ' is-error' : ''}`} role={isError ? 'alert' : undefined}>
                    {isLoading ? "Loading class details…" : isError ? "Unable to load class details. Try refreshing the page." : "Class details not found."}
                </p>
            </ShowView>
        )
    }

    const teacher = classDetails.teacher;
    const teacherName = teacher?.name ?? 'Unknown';
    const teachersInitials = teacherName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    
    const placeholder = `https://placehold.co/600x400?text=${encodeURIComponent(teachersInitials || "NA")}`;

    const subject = classDetails.subject;
    const departmentName = classDetails.department?.name ?? teacher?.department;
    const departmentDescription = classDetails.department?.description;

    return (
        <ShowView className='class-view class-show'>
            <ShowViewHeader resource='classes' title='Class Details' />
            
            <div className='banner'>
                {classDetails.bannerUrl ? (
                    <img src={classDetails.bannerUrl} alt={classDetails.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                    <div className='placeholder' />
                )}
            </div>

            <Card className='details-card'>
                <div className='details-header'>
                    <div>
                        <h1>{classDetails.name}</h1>
                        <p>{classDetails.description}</p>
                    </div>
                    <Badge variant="outline">
                        {classDetails.capacity} spots
                    </Badge>
                    <Badge
                        variant={classDetails.status === 'active' ? 'default' : 'secondary'}
                        data-status={classDetails.status}
                    >
                        {classDetails.status.toUpperCase()}
                    </Badge>
                </div>

                <div className='details-grid'>
                    <div className='instructor'>
                        <p>Instructor</p>
                        <div className="h-12 w-12 overflow-hidden rounded-full border">
                            <img
                                src={teacher?.image || placeholder}
                                alt={teacherName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p>{teacherName}</p>
                        <p>{teacher?.email}</p>
                        
                        {departmentName && (
                            <div className='department'>
                                <p>Department</p>
                                <div>
                                    <p>{departmentName}</p>
                                    {departmentDescription && <p>{departmentDescription}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {subject && (
                    <div className="subject">
                        <p>Subject</p>
                        <div>
                            <Badge variant="outline">Code: {subject.code}</Badge>
                            <p className="font-semibold">{subject.name}</p>
                            <p className="font-semibold">{subject.description}</p>
                        </div>
                    </div>
                )}
                <Separator />
                <div className='join'>
                    <h2>Join Class</h2>
                    <ol>
                        <li>Ask your teacher for the invite code</li>
                        <li>Click on Join class button</li>
                        <li>Paste the code and click "join"</li>
                    </ol>
                </div>
            </Card>
        </ShowView>
    )
}

export default ClassesShow
