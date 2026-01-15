import React from 'react'

const PageTitle = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='d-flex flex-row gap-2 mb-4 mt-2 align-items-end'>
    <h2 className='font-bold m-0'>
      .:{children}:.
    </h2>
    <small>PT Perdana Adhi Lestari</small>
    </div>
  )
}

export default PageTitle