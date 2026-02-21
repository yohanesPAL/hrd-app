import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'

const Absensi = () => {
  return (
    <>
      <PageTitle>Absensi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage/>
      </div>
    </>
  )
}

export default Absensi