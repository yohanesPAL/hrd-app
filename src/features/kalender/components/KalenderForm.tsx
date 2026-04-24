"use client";
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import { EventForm } from '@/modules/event/event.schema';
import { Dispatch, SetStateAction } from 'react';

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const KalenderForm = ({
  modal,
  event,
  isPending,
}: {
  modal: {
    show: boolean,
    onClosed: () => void,
  }
  event: {
    selected: string,
    form: EventForm,
    setForm: Dispatch<SetStateAction<EventForm>>,
    onSubmit: (payload: EventForm) => void,
    onDelete: (id: string) => void,
  }
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClosed} className="p-0">
      <Form onSubmit={(e) => {
        e.preventDefault();
        event.onSubmit(event.form);
      }}>
        <Modal.Header>
          <Modal.Title>{event.selected === "" ? "Tambah" : "Edit"} Acara</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              value={event.form.title}
              onChange={(e) => event.setForm({ ...event.form, title: e.currentTarget.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Awal</Form.Label>
            <Form.Control
              required
              type="datetime-local"
              value={toDatetimeLocal(event.form.start)}
              onChange={(e) => event.setForm({ ...event.form, start: new Date(e.currentTarget.value) })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Akhir</Form.Label>
            <Form.Control
              required
              type="datetime-local"
              value={toDatetimeLocal(event.form.end)}
              onChange={(e) => event.setForm({ ...event.form, end: new Date(e.currentTarget.value) })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row align-items-center justify-content-between w-100">
            {event.selected !== "" ? <Button type="button" variant="danger" onClick={() => event.onDelete(event.selected)} disabled={isPending}>Hapus</Button> : <div></div>}
            <Stack direction="horizontal" gap={2}>
              <Button type="button" variant="warning" disabled={isPending} onClick={modal.onClosed}>Batal</Button>
              <Button type="submit" variant="primary" disabled={isPending}>{event.selected !== "" ? "Update" : "Submit"}</Button>
            </Stack>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default KalenderForm