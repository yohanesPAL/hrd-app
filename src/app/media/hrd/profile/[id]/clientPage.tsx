'use client'
import PageTitle from '@/components/PageTitle';
import { ProfileInterface } from '@/types/ProfileType'
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify'
import styles from './profile.module.css'

const ClientPage = ({ data, err }: { data: ProfileInterface | null, err: any }) => {
  if (err) toast.error(err.error);

  let statusAktif = '';
  if(data) {
    statusAktif = data?.status_aktif === "1" ? "Aktif" : "Non Aktif"
  }

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <Table className={`w-100 table-bordered ${styles.tableBg}`}>
          <tbody>
            <tr>
              <td style={{width:"15%"}}>NIK</td>
              <td>:</td>
              <td style={{width:"35%"}}>{data?.nik}</td>

              <td style={{width:"15%"}}>Cuti Terakhir</td>
              <td>:</td>
              <td style={{width:"35%"}}>{data?.cuti_terakhir}</td>
            </tr>
            <tr>
              <td>Nama</td><td>:</td><td>{data?.nama}</td>
              <td>Cuti Sekarang</td><td>:</td><td>{data?.cuti_sekarang}</td>
            </tr>
            <tr>
              <td>Jenis Kelamin</td><td>:</td><td>{data?.jk}</td>
              <td>Status Aktif</td><td>:</td><td>{statusAktif}</td>
            </tr>
            <tr>
              <td>Alamat</td><td>:</td><td>{data?.alamat}</td>
              <td>Status Karyawan</td><td>:</td><td>{data?.status_karyawan}</td>
            </tr>
            <tr>
              <td>HP</td><td>:</td><td>{data?.hp || "-"}</td>
              <td>Tanggal Masuk</td><td>:</td><td>{data?.tgl_masuk.slice(0, 10) || "-"}</td>
            </tr>
            <tr>
              <td>Divisi</td><td>:</td><td>{data?.divisi}</td>
              <td>Tanggal Keluar</td><td>:</td><td>{data?.tgl_keluar.slice(0, 10) || "-"}</td>
            </tr>
            <tr>
              <td>Jabatan</td><td>:</td><td>{data?.jabatan}</td>
              <td>Durasi Kontrak</td><td>:</td><td>{data?.durasi_kontrak || "-"}</td>
            </tr>
            <tr>
              <td>SP</td><td>:</td><td>{data?.sp}</td>
              <td>Kode Absensi</td><td>:</td><td>{data?.kode_absensi}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default ClientPage