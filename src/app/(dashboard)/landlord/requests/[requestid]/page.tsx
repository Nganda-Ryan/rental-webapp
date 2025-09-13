"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import { geRequestDetail } from '@/actions/requestAction';
import { getScore } from '@/actions/userAction';

const Page = () => {
    const params = useParams();
    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        const result = await geRequestDetail(params.requestid as string);
        const result2 = await getScore(result.data.body.reqData.creator.UserCode as string);
        console.log('-->result', result.data.body.reqData.creator)
        console.log('-->result2', result2)
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={`Application detail`} />
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                Request detail page
            </div>
        </DefaultLayout>
    )
}

export default Page