import PageTitle from '@/components/PageTitle'
import React from 'react'
import ClientPage from './clientPage'

const page = () => {
  return (
    <>
      <PageTitle>Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage />
      </div>
    </>
  )
}

export default page