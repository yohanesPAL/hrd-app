import PageTitle from '@/components/PageTitle';
import DepoPage from '@/features/master/depo/components/DepoPage';
import { getAllDepoAction } from '@/features/master/depo/DepoActions'

const Depo = async () => {
  const depo = await getAllDepoAction()
  
  return (
    <>
      <PageTitle>Depo</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <DepoPage depoData={depo.data ?? []} />
      </div>
    </>
  )
}

export default Depo