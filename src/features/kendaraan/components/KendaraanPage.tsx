"use client"
import ExportToExcel from '@/components/Buttons/ExportToExcel'
import DefaultTable from '@/components/Table/DefaulteTable'
import useProfile from '@/stores/profile/profile.store'
import { ColumnDef, Table } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { kendaraanColumns } from '../columns/KendaraanColumns'
import { CarTable } from '@/modules/car/car.schema'


const defaultSort = [{ id: "no", desc: false }]

const KendaraanPage = ({ data }: { data: CarTable[] }) => {
  const router = useRouter();
  const role = useProfile((state) => state.profile?.role);

  const [table, setTable] = useState<Table<CarTable> | null>(null);

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
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />
    </>
  )
}

export default KendaraanPage