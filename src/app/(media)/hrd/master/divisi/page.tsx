import PageTitle from '@/components/PageTitle'
import DivisiPage from '@/features/master/divisi/components/DivisiPage';
import { createDivisionService } from '@/modules/divisi/division.factory'
import { DivisionTable } from '@/modules/divisi/division.schema';

const Divisi = async () => {  
  const divisionService = createDivisionService();
  const division: DivisionTable[] = await divisionService.getAllDivisions();
  
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