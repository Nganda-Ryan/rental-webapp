'use client'

import { useRouter } from '@bprogress/next/app';
import { useParams } from 'next/navigation';
import React from 'react'

 const Page = () => {
    const params = useParams();
    const router = useRouter();

    const userId = params.userId;


    return (
        <div>page</div>
    )
}


export default Page;