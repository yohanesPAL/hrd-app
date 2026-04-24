import { EmployeeKodeAbsenForm } from '@/modules/employee/employee.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { KaryawanOnEdit } from '../types/KaryawanTypes';

const KaryawanKodeAbsenModal = ({
  modal,
  absentCode,
  employeeOnEdit,
  isPending,
}: {
  modal: {
    show: boolean,
    onClosed: () => void,
  },
  absentCode: {
    onUpdate: (data: EmployeeKodeAbsenForm) => void,
    form: EmployeeKodeAbsenForm,
    setForm: Dispatch<SetStateAction<EmployeeKodeAbsenForm>>,
  }
  employeeOnEdit: KaryawanOnEdit,
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClosed}>
      <Modal.Header>
        <Modal.Title>Ubah Kode Absensi</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        absentCode.onUpdate(absentCode.form);
      }}>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                required
                disabled
                value={employeeOnEdit.nama}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kode Absen</Form.Label>
              <Form.Control
                type='text'
                required
                value={absentCode.form.kode_absensi ?? ""}
                onChange={(e) => absentCode.setForm({ kode_absensi: e.currentTarget.value })}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPending} onClick={modal.onClosed}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPending}>Update</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default KaryawanKodeAbsenModal