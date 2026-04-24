'use client';
import { BaseDivision, DivisionForm } from '@/modules/master/divisi/division.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap'

const DivisiFormModal = ({
  modal,
  divisi,
  isPending,
}: {
  modal: {
    show: boolean,
    onClosed: () => void,
  },
  divisi: {
    form: DivisionForm,
    setForm: Dispatch<SetStateAction<DivisionForm>>,
    onSubmit: (data: DivisionForm) => void,
    onEdit: BaseDivision["id"],
  }
  isPending: boolean,
}) => {

  return (
    <Modal show={modal.show} onHide={modal.onClosed}>
      <Form onSubmit={(e) => {
        e.preventDefault();
        divisi.onSubmit(divisi.form);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{divisi.onEdit === "" ? "Tambah" : "Update"} Divisi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Nama Divisi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Admin'
                required
                autoFocus
                value={divisi.form.nama}
                onChange={(e) => divisi.setForm(prev => ({ ...prev, nama: e.target.value }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                required
                value={divisi.form.is_active}
                onChange={(e) => divisi.setForm(prev => ({ ...prev, is_active: Number(e.target.value) }))}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>
          </Stack>
        </Modal.Body>

        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPending} onClick={modal.onClosed}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPending}>Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default DivisiFormModal