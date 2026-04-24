import { CarForm } from '@/modules/car/car.schema'
import { Table } from 'react-bootstrap'

const KendaraanDetail = ({ data }: { data: CarForm | undefined }) => {
  return (

    <Table className={`w-100`} style={{ marginBottom: "48px" }}>
      <tbody>
        <tr>
          <td style={{ width: "15%" }}>Nama</td>
          <td>:</td>
          <td style={{ width: "35%" }}>{data?.nama}</td>

          <td style={{ width: "15%" }}>Jenis</td>
          <td>:</td>
          <td style={{ width: "35%" }}>{data?.jenis}</td>
        </tr>
        <tr>
          <td>No Polisi</td><td>:</td><td>{data?.nopol}</td>
          <td>Merk</td><td>:</td><td>{data?.merk}</td>
        </tr>
        <tr>
          <td>Depo</td><td>:</td><td>{data?.depo}</td>
          <td>Tahun</td><td>:</td><td>{data?.tahun}</td>
        </tr>
        <tr>
          <td>Jumlah Roda</td><td>:</td><td>{data?.jumlah_roda}</td>
          <td>Status</td><td>:</td><td>{data?.status}</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default KendaraanDetail