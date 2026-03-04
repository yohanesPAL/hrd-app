import { EmployeeKodeAbsenForm } from '@/modules/employee/employee.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { KaryawanOnEdit } from '../types/KaryawanTypes';

const KaryawanKodeAbsenModal = ({
  showModalAbsen,
  onCloseModalAbsen,
  onUpdateKodeAbsen,
  karyawanOnEdit,
  kodeAbsenForm,
  setKodeAbsenForm,
  isPosting,
}: {
  showModalAbsen: boolean,
  onCloseModalAbsen: () => void,
  onUpdateKodeAbsen: (data: EmployeeKodeAbsenForm) => void,
  karyawanOnEdit: KaryawanOnEdit,
  kodeAbsenForm: EmployeeKodeAbsenForm,
  setKodeAbsenForm: Dispatch<SetStateAction<EmployeeKodeAbsenForm>>,
  isPosting: boolean,
}) => {
  return (
    <Modal show={showModalAbsen} onHide={onCloseModalAbsen}>
      <Modal.Header>
        <Modal.Title>Ubah Kode Absensi</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onUpdateKodeAbsen(kodeAbsenForm);
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
              <Form.Label>Kode Absen</Form.Label>
              <Form.Control
                type='text'
                required
                value={kodeAbsenForm.kode_absensi ?? ""}
                onChange={(e) => setKodeAbsenForm({ kode_absensi: e.currentTarget.value })}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPosting} onClick={onCloseModalAbsen}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPosting}>Update</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default KaryawanKodeAbsenModal