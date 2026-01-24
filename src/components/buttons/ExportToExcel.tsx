import { Button } from 'react-bootstrap'

const ExportToExcel = ({ onExport }: { onExport: () => void }) => { 

  return (
    <Button variant='success' type='button' onClick={onExport}>
      <i className="bi bi-file-earmark-excel-fill"></i>
      <span>Export to Excel</span>
    </Button>
  )
}

export default ExportToExcel