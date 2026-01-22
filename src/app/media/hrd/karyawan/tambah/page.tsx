import PageTitle from '@/components/PageTitle'
import React from 'react'
import KaryawanForm from './karyawanForm'

const TambahKaryawan = () => {
  return (
    <>
      <PageTitle>Tambah Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanForm />
      </div>
    </>
  )
}

export default TambahKaryawan