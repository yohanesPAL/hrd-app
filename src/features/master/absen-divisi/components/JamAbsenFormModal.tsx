import { JamAbsenForm } from '@/modules/master/jamAbsen/jamAbsen.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';

const JamAbsenFormModal = ({
  modal,
  jamAbsen,
  isPending,
}:{
  modal: {
    show: boolean,
    onClosed: () => void,
  },
  jamAbsen: {
    onSubmit: (data: JamAbsenForm) => void,
    form: JamAbsenForm,
    setForm: Dispatch<SetStateAction<JamAbsenForm>>,
  },
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClosed}>
        <Modal.Header>
          <Modal.Title>Ubah Jam Absen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          jamAbsen.onSubmit(jamAbsen.form);
        }}>
          <Modal.Body>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Control
                  type="text"
                  value={jamAbsen.form.nama_divisi}
                  required
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Masuk</Form.Label>
                <Form.Control
                  type="time"
                  value={jamAbsen.form.masuk}
                  onChange={(e) => jamAbsen.setForm(prev =>({ ...prev, masuk: e.target.value }))}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar</Form.Label>
                <Form.Control
                  type="time"
                  value={jamAbsen.form.keluar}
                  onChange={(e) => jamAbsen.setForm(prev =>({ ...prev, keluar: e.target.value }))}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar (Sabtu)</Form.Label>
                <Form.Control
                  type="time"
                  value={jamAbsen.form.keluar_sabtu}
                  onChange={(e) => jamAbsen.setForm(prev =>({ ...prev, keluar_sabtu: e.target.value }))}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="danger" disabled={isPending} onClick={modal.onClosed}>Batal</Button>
            <Button type="submit" variant="success" disabled={isPending}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal >
  )
}

export default JamAbsenFormModal