import PageTitle from '@/components/PageTitle'
import ClientPage from '../../../../../features/master/jabatan/components/JabatanPage';
import { getDivisionsAction } from '@/features/master/divisi/divisiAction';
import { getPositionsAction } from '@/features/master/jabatan/jabatanAction';

const Jabatan = async () => {
  const [divisions, positions] = await Promise.all([
    getDivisionsAction(),
    getPositionsAction(),
  ]);

  return (
    <>
      <PageTitle>Jabatan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={positions} divisiList={divisions}/>
      </div>
    </>
  )
}

export default Jabatan