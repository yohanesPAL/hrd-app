"use client";
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import { EventModal } from '../types/KalenderTypes';
import { EventForm } from '@/modules/event/event.schema';
import { Dispatch, SetStateAction } from 'react';

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const KalenderForm = ({
  showModal,
  onModalClose,
  onSubmit,
  eventForm,
  setEventForm,
  isPosting,
  onDeleteAcara,
  eventId,
}: {
  showModal: EventModal,
  onModalClose: () => void,
  onSubmit: (payload: EventForm) => void,
  eventForm: EventForm,
  setEventForm: Dispatch<SetStateAction<EventForm>>,
  isPosting: boolean,
  onDeleteAcara: (id: string) => void,
  eventId: string,
}) => {
  return (
    <Modal show={showModal.show} onHide={onModalClose} className="p-0">
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(eventForm);
      }}>
        <Modal.Header>
          <Modal.Title>{showModal.type === "add" ? "Tambah" : "Edit"} Acara</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.currentTarget.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Awal</Form.Label>
            <Form.Control
              required
              type="datetime-local"
              value={toDatetimeLocal(eventForm.start)}
              onChange={(e) => setEventForm({ ...eventForm, start: new Date(e.currentTarget.value) })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Akhir</Form.Label>
            <Form.Control
              required
              type="datetime-local"
              value={toDatetimeLocal(eventForm.end)}
              onChange={(e) => setEventForm({ ...eventForm, end: new Date(e.currentTarget.value) })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row align-items-center justify-content-between w-100">
            {showModal.type === "edit" ? <Button type="button" variant="danger" onClick={() => onDeleteAcara(eventId)} disabled={isPosting}>Hapus</Button> : <div></div>}
            <Stack direction="horizontal" gap={2}>
              <Button type="button" variant="warning" disabled={isPosting} onClick={onModalClose}>Batal</Button>
              <Button type="submit" variant="primary" disabled={isPosting}>{showModal.type === "edit" ? "Update" : "Submit"}</Button>
            </Stack>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default KalenderForm