import PageTitle from '@/components/PageTitle'
import DivisiPage from '@/features/master/divisi/components/DivisiPage';
import { getDivisionsAction } from '@/features/master/divisi/divisiAction';
import { DivisionTable } from '@/modules/divisi/division.schema';

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const Divisi = async () => {  
  await sleep(2000);
  const division: DivisionTable[] = await getDivisionsAction()

  return (
    <>
      <PageTitle>Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <DivisiPage data={division} />
      </div>
    </>
  )
}

export default Divisi