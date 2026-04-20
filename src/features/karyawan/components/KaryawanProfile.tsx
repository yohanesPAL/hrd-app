'use client'
import PageTitle from '@/components/PageTitle';
import { Table } from 'react-bootstrap';
import { BaseEmployee } from '@/modules/employee/employee.schema';
import { formatDateDDMMYYYY } from '@/utils/dateFormatting';
import { EmployeeContractTable } from '@/modules/employee/contract/employee.contract.schema';
import ContractsTable from '../contract/components/ContractsTable';

const KaryawanProfile = ({ profile, contracts }: { profile: BaseEmployee, contracts: EmployeeContractTable[] }) => {
  let statusAktif = '';
  if (profile) statusAktif = profile?.is_active ? "Aktif" : "Non Aktif"

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <div className='page-container-border bg-white table-bg rounded p-2 pt-4'>
        <Table className={`w-100`} style={{ marginBottom: "48px" }}>
          <tbody>
            <tr>
              <td style={{ width: "15%" }}>NIK</td>
              <td>:</td>
              <td style={{ width: "35%" }}>{profile?.nik}</td>

              <td style={{ width: "15%" }}>Cuti Terakhir</td>
              <td>:</td>
              <td style={{ width: "35%" }}>{profile?.cuti_terakhir} Hari</td>
            </tr>
            <tr>
              <td>Nama</td><td>:</td><td>{profile?.nama}</td>
              <td>Cuti Sekarang</td><td>:</td><td>{profile?.cuti_sekarang} Hari</td>
            </tr>
            <tr>
              <td>Alamat</td><td>:</td><td>{profile?.alamat}</td>
              <td>Status Aktif</td><td>:</td><td>{statusAktif}</td>
            </tr>
            <tr>
              <td>Jenis Kelamin</td><td>:</td><td>{profile?.jk}</td>
              <td>Tanggal Masuk</td><td>:</td><td>{formatDateDDMMYYYY(profile?.tgl_masuk) || "-"}</td>
            </tr>
            <tr>
              <td>HP</td><td>:</td><td>{profile?.hp || "-"}</td>
              <td>Tanggal Keluar</td><td>:</td><td>{formatDateDDMMYYYY(profile?.tgl_keluar) || "-"}</td>
            </tr>
            <tr>
              <td>Divisi</td><td>:</td><td>{profile?.divisi}</td>
              <td>SP</td><td>:</td><td>{profile?.sp}</td>
            </tr>
            <tr>
              <td>Jabatan</td><td>:</td><td>{profile?.jabatan}</td>
              <td>Kode Absensi</td><td>:</td><td>{profile?.kode_absensi}</td>
            </tr>
          </tbody>
        </Table>

        <ContractsTable contracts={contracts} />
      </div>
    </>
  )
}

export default KaryawanProfile