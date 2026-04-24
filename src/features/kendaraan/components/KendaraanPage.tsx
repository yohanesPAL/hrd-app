"use client"
import DefaultTable from '@/components/Table/DefaulteTable'
import useProfile from '@/stores/profile/profile.store'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { kendaraanColumns } from '../columns/KendaraanColumns'
import { BaseCar, CarTable } from '@/modules/car/car.schema'
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store'
import { deleteCarAndMaintenanceAction } from '../mobilAction'
import { useActionHandler } from '@/hooks/useActionHandler'

const defaultSort = [{ id: "no", desc: false }];

const KendaraanPage = ({ carTable }: { carTable: CarTable[] }) => {
  const router = useRouter();
  const role = useProfile((state) => state.profile?.role);
  const { openConfirmDelete } = useConfirmDelete();
  const { run, isPending } = useActionHandler();

  const [table, setTable] = useState<Table<CarTable> | null>(null);

  const deleteCar = async (carId: BaseCar["id"]) => {
    await run(deleteCarAndMaintenanceAction, [carId], {
      toast: {
        pending: "Menghapus kendaraan...",
        success: "Berhasil hapus kendaraan",
        error: "Ooops... ada yang salah"
      },
      refresh: true
    })
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
        data={carTable ?? []}
        columns={kendaraanColumns({
          role,
          router,
          onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => deleteCar(id)),
          isPending,
        })}
        loading={isPending}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />
    </>
  )
}

export default KendaraanPage