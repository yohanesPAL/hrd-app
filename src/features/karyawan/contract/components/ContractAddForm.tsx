import { EmployeeContractForm } from '@/modules/employee/contract/employee.contract.schema'
import { formatDateYYYYMMDD } from '@/utils/dateFormatting'
import { Dispatch, SetStateAction } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap'

const ContractAddForm = ({
  modal,
  contract,
  isPending,
}: {
  modal: {
    show: boolean,
    onClose: () => void,
  }
  contract: {
    onEdit: string,
    form: EmployeeContractForm,
    setForm: Dispatch<SetStateAction<EmployeeContractForm>>,
    onSubmit: (data: EmployeeContractForm) => void,
  }
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClose}>
      <Modal.Header>
        <Modal.Title>{contract.onEdit === "" ? "Tambah" : "Edit"} Kontrak</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        contract.onSubmit(contract.form);
      }}>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Jenis</Form.Label>
              <Form.Select
                required
                value={contract.form.jenis}
                onChange={(e) => {
                  if (e.currentTarget.value === "tetap") {
                    contract.setForm(prev => ({ ...prev, tgl_berakhir: null }))
                  } else {
                    contract.setForm(prev => ({ ...prev, tgl_berakhir: new Date() }))
                  }
                  contract.setForm(prev => ({ ...prev, jenis: e.target.value as EmployeeContractForm["jenis"] }))
                }}
              >
                <option value={"tetap"}>Tetap</option>
                <option value={"kontrak"}>Kontrak</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Tanggal Kontrak</Form.Label>
              <Form.Control
                type='date'
                required
                value={formatDateYYYYMMDD(contract.form.tgl_kontrak)}
                onChange={(e) => contract.setForm(prev => ({ ...prev, tgl_kontrak: new Date(e.target.value) }))}
              />
            </Form.Group>
            {
              contract.form.jenis === "kontrak" && (
                <Form.Group>
                  <Form.Label>Tanggal Berakhir</Form.Label>
                  <Form.Control
                    type='date'
                    required
                    value={contract.form.tgl_berakhir ? formatDateYYYYMMDD(contract.form.tgl_berakhir) : ""}
                    onChange={(e) => contract.setForm(prev => ({ ...prev, tgl_berakhir: new Date(e.target.value) }))}
                  />
                </Form.Group>
              )
            }
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant='danger' onClick={modal.onClose}>Cancel</Button>
          <Button type="submit" variant='primary' disabled={isPending}>Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ContractAddForm