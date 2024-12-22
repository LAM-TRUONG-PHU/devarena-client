import VerifyForm from '@/components/verfiy/VerifyForm'
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

const Page = () => {

    
    return (
        <div>
            <VerifyForm/> {/* Truyền email vào VerifyForm */}
        </div>
    );
}

export default Page
