import PageTitle from '@/components/PageTitle'
import ImportPage from './importPage'

const Absensi = () => {
  return (
    <>
      <PageTitle>Absensi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ImportPage/>
      </div>
    </>
  )
}

export default Absensi