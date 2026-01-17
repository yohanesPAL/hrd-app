import ResponsiveChart from "../ResponsiveChart"
import karyawanTetap from "@/mock/dashboard/karyawanTetapChart"
import percentageChartLabel from "../PercentageLabel"

const KaryawanTetap = () => {
  return (
    <ResponsiveChart data={karyawanTetap} label={percentageChartLabel} title='Karyawan Tetap'/>
  )
}

export default KaryawanTetap