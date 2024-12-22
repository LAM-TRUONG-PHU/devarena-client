import { CodingExerciseForm } from '@/components/admin/CodingExerciseForm';
import { ExerciseCreate } from '@/components/admin/study/ExerciseCreate';
import React, { use } from 'react'

const page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params); // Unwrap the params to get the slug

  return (
    <div>
      {/* <CodingExerciseForm language={slug}/> */}
      <ExerciseCreate/>
    </div>
  )
}

export default page
