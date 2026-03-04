import { EmployeeSpForm } from '@/modules/employee/employee.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { KaryawanOnEdit } from '../types/KaryawanTypes';

const KaryawanSpModal = ({
  showModalSp,
  onCloseModalSp,
  onUpdateSp,
  karyawanOnEdit,
  spForm,
  setSpForm,
  isPosting,
}: {
  showModalSp: boolean,
  onCloseModalSp: () => void,
  onUpdateSp: (data: EmployeeSpForm) => void,
  karyawanOnEdit: KaryawanOnEdit,
  spForm: EmployeeSpForm,
  setSpForm: Dispatch<SetStateAction<EmployeeSpForm>>,
  isPosting: boolean,
}) => {
  return (
    <Modal show={showModalSp} onHide={onCloseModalSp}>
      <Modal.Header>
        <Modal.Title>Ubah SP Karyawan</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onUpdateSp(spForm);
      }}>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                required
                disabled
                value={karyawanOnEdit.nama}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>SP</Form.Label>
              <Form.Control
                type='text'
                required
                value={spForm.sp}
                onChange={(e) => setSpForm({ sp: Number(e.currentTarget.value) })}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPosting} onClick={onCloseModalSp}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPosting}>Update</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default KaryawanSpModal