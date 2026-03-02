"use client";
import DefaultTable from '@/components/Table/DefaulteTable'
import { AbsensiDetailTable } from '@/modules/absensi/detail/absensi.detail.schema'
import { absensiDetailsColumn } from '../columns/AbsensiDetailsColumn'
import { SortingState } from '@tanstack/react-table'

const defaultSort: SortingState = [{ id: "no", desc: false }]

const AbsensiDetailsPage = ({
  absensi
}: {
  absensi: AbsensiDetailTable[]
}) => {
  return (
    <>
      <DefaultTable<AbsensiDetailTable>
        data={absensi}
        columns={absensiDetailsColumn()}
        defaultSort={defaultSort}
      />
    </>
  )
}

export default AbsensiDetailsPage