import { param } from 'motion/react-client'
import EditKaryawanForm from './editKaryawanForm'
import PageTitle from '@/components/PageTitle'

const EditKaryawan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <>
      <PageTitle>Edit Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <EditKaryawanForm karyawanId={id}/>
      </div>
    </>
  )
}

export default EditKaryawan
