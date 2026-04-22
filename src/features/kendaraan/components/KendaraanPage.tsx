"use client"
import DefaultTable from '@/components/Table/DefaulteTable'
import useProfile from '@/stores/profile/profile.store'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { kendaraanColumns } from '../columns/KendaraanColumns'
import { CarTable } from '@/modules/car/car.schema'
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store'
import { useShallow } from 'zustand/shallow'
import { useExecuteAction } from '@/hooks/useExecuteAction'
import { toast } from 'react-toastify'
import { deleteCarAndMaintenanceAction } from '../mobilAction'


const defaultSort = [{ id: "no", desc: false }]

const KendaraanPage = ({ data }: { data: CarTable[] }) => {
  const { setOpen: openConfirmDelete, isPosting } = useConfirmDelete(useShallow((state) => ({
    setOpen: state.setOpen,
    isPosting: state.isPosting,
  })));

  const router = useRouter();
  const role = useProfile((state) => state.profile?.role);

  const [table, setTable] = useState<Table<CarTable> | null>(null);
  const {executeAction, isSuspense} = useExecuteAction()

  const onDelete = async (id: string) => {
    await toast.promise(
      executeAction(deleteCarAndMaintenanceAction, id), {
        pending: "Menghapus kendaraan...",
        success: "Berhasil hapus kendaraan",
        error: "Ooops... ada yang salah"
      }
    )
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => router.push(`/${role}/kendaraan/tambah`)}>
          <i className='bi bi-truck'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
        {/* <ExportToExcel onExport={onExport} /> */}
      </Stack>

      <DefaultTable<CarTable>
        data={data ?? []}
        columns={kendaraanColumns({
          role,
          router,
          deleteKendaraan: {
            openConFirmDelete: openConfirmDelete,
            onDelete: onDelete,
          },
          isPosting: isPosting,
        })}
        loading={isSuspense}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />
    </>
  )
}

export default KendaraanPage