import React from 'react';
import { LoadingSpinner } from './loading';

export default function DialogLoading() {
    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 translate-y-10 z-50 bg-white shadow-md px-6 py-4 rounded-md text-gray-700">
            <LoadingSpinner />
            Loading...
        </div>
    );
}
