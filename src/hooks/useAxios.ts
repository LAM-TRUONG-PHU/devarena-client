import { mainInstance } from '@/axios/MainInstance'
import React from 'react'

const useAxios = () => {
    return mainInstance
}

export default useAxios
