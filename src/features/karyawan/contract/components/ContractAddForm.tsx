import { EmployeeContractForm } from '@/modules/employee/contract/employee.contract.schema'
import { formatDateYYYYMMDD } from '@/utils/dateFormatting'
import { Dispatch, SetStateAction } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap'

const ContractAddForm = ({
  showModal,
  onCloseModal,
  contractOnEdit,
  contractForm,
  setContractForm,
  isPosting,
  onSubmit,
}: {
  showModal: boolean,
  onCloseModal: () => void,
  contractOnEdit: string,
  contractForm: EmployeeContractForm,
  setContractForm: Dispatch<SetStateAction<EmployeeContractForm>>,
  isPosting: boolean,
  onSubmit: (data: EmployeeContractForm) => void,
}) => {
  return (
    <Modal show={showModal} onHide={onCloseModal}>
      <Modal.Header>
        <Modal.Title>{contractOnEdit === "" ? "Tambah" : "Edit"} Kontrak</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(contractForm);
      }}>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Jenis</Form.Label>
              <Form.Select
                required
                value={contractForm.jenis}
                onChange={(e) => {
                  if (e.currentTarget.value === "tetap") {
                    setContractForm({ ...contractForm, tgl_berakhir: null })
                  } else {
                    setContractForm({ ...contractForm, tgl_berakhir: new Date() })
                  }
                  setContractForm({ ...contractForm, jenis: e.currentTarget.value as EmployeeContractForm["jenis"] })
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
                value={formatDateYYYYMMDD(contractForm.tgl_kontrak)}
                onChange={(e) => setContractForm({ ...contractForm, tgl_kontrak: new Date(e.currentTarget.value) })}
              />
            </Form.Group>
            {
              contractForm.jenis === "kontrak" && (
                <Form.Group>
                  <Form.Label>Tanggal Berakhir</Form.Label>
                  <Form.Control
                    type='date'
                    required
                    value={contractForm.tgl_berakhir ? formatDateYYYYMMDD(contractForm.tgl_berakhir) : ""}
                    onChange={(e) => setContractForm({ ...contractForm, tgl_berakhir: new Date(e.currentTarget.value) })}
                  />
                </Form.Group>
              )
            }
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant='danger' onClick={onCloseModal}>Cancel</Button>
          <Button type="submit" variant='primary' disabled={isPosting}>Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ContractAddForm