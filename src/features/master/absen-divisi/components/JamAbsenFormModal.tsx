import { JamAbsenForm } from '@/modules/master/jamAbsen/jamAbsen.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';

const JamAbsenFormModal = ({
  show,
  onModalClose,
  onSubmit,
  editForm,
  setEditForm,
  isPosting,
}:{
  show: boolean,
  onModalClose: () => void,
  onSubmit: (data: JamAbsenForm) => void,
  editForm: JamAbsenForm,
  setEditForm: Dispatch<SetStateAction<JamAbsenForm>>,
  isPosting: boolean,
}) => {
  return (
    <Modal show={show} onHide={onModalClose}>
        <Modal.Header>
          <Modal.Title>Ubah Jam Absen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(editForm);
        }}>
          <Modal.Body>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.nama_divisi}
                  required
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Masuk</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.masuk}
                  onChange={(e) => setEditForm({ ...editForm, masuk: e.currentTarget.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.keluar}
                  onChange={(e) => setEditForm({ ...editForm, keluar: e.currentTarget.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar (Sabtu)</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.keluar_sabtu}
                  onChange={(e) => setEditForm({ ...editForm, keluar_sabtu: e.currentTarget.value })}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="danger" disabled={isPosting} onClick={onModalClose}>Batal</Button>
            <Button type="submit" variant="success" disabled={isPosting}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal >
  )
}

export default JamAbsenFormModal