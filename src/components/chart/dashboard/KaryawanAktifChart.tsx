import karyawanAktif from '@/mock/dashboard/karyawanAktfChart'
import percentageChartLabel from '../PercentageLabel'
import ResponsiveChart from '../ResponsiveChart'

const KaryawanAktifChart = () => {
  return (
    <ResponsiveChart data={karyawanAktif} label={percentageChartLabel} title='Karyawan Aktif'/>
  )
}

export default KaryawanAktifChart