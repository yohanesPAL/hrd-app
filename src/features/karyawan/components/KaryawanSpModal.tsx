import { EmployeeSpForm } from '@/modules/employee/employee.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { KaryawanOnEdit } from '../types/KaryawanTypes';

const KaryawanSpModal = ({
  modal,
  sp,
  employeeOnEdit,
  isPending,
}: {
  modal: {
    show: boolean,
    onClosed: () => void
  }
  sp: {
    onUpdate:(data: EmployeeSpForm) => void,
    form: EmployeeSpForm,
    setForm:Dispatch<SetStateAction<EmployeeSpForm>>,
  }
  employeeOnEdit: KaryawanOnEdit,
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClosed}>
      <Modal.Header>
        <Modal.Title>Ubah SP Karyawan</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        sp.onUpdate(sp.form);
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
              <Form.Label>SP</Form.Label>
              <Form.Control
                type='text'
                required
                value={sp.form.sp}
                onChange={(e) => sp.setForm((prev) => ({ ...prev, sp: Number(e.target.value) }))}
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

export default KaryawanSpModal