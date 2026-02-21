import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'
import { mockMobilData } from '@/mock/MobilMock'

const Mobil = () => {
  return (
    <>
      <PageTitle>Mobil</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={mockMobilData}/>
      </div>
    </>
  )
}

export default Mobil