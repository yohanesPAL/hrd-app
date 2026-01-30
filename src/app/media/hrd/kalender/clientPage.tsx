'use client'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, set } from "date-fns";
import { id } from "date-fns/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen/LoadingScreen";

interface EventModal {
  show: boolean;
  type: "add" | "edit";
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const locales = {
  "id-ID": id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventDefault: EventForm = { title: "", start: new Date(), end: new Date() }

const ClientPage = ({ data }: { data: EventData[] }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState<EventModal>({ show: false, type: "add" });
  const [eventForm, setEventForm] = useState<EventForm>(eventDefault)
  const [editingId, setEditingId] = useState<string>("");
  const [events, setEvents] = useState<EventData[]>(data);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onModalClose = () => {
    setShowModal({ show: false, type: "add" });
    setEventForm(eventDefault);
    setEditingId("");
  }

  const postAcara = async (payload: EventForm) => {
    const res = await fetch("/api/acara", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      setIsPosting(false)
      throw new Error(body?.error ?? "request failed")
    }

    return body
  }

  const patchAcara = async (payload: EventData) => {
    const res = await fetch(`/api/acara/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      setIsPosting(false)
      throw new Error(body?.error ?? "request failed")
    }

    return body
  }

  const onSubmit = (payload: EventForm, e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!payload) return toast.error("data tidak boleh kosong");
    setIsPosting(true)

    if (showModal.type === "add") {
      toast.promise(
        postAcara(payload).then(() => {
          startTransition(() => {
            router.refresh();
          })
          setIsPosting(false);
          setShowModal({ show: false, type: "add" });
          setEventForm(eventDefault);
        }), {
        pending: "Menambah acara...",
        success: "Berhasil tambah acara",
        error: {
          render({ data }) {
            if (data instanceof Error) {
              return data.message
            }
            return "Request failed"
          }
        }
      })
    } else if (showModal.type === "edit") {
      toast.promise(
        patchAcara({ ...payload, id: editingId }).then(() => {
          startTransition(() => {
            router.refresh();
          })
          setIsPosting(false);
          setShowModal({ show: false, type: "add" });
          setEventForm(eventDefault);
          setEditingId("");
        }), {
        pending: "Update acara...",
        success: "Berhasil update acara",
        error: {
          render({ data }) {
            if (data instanceof Error) {
              return data.message
            }
            return "Request failed"
          }
        }
      })
    }
  }

  const deleteAcara = async (id: string) => {
    const res = await fetch(`/api/acara/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(id)
    })

    const body = await res.json().catch(() => null)
    if (!res.ok) {
      setIsPosting(false)
      throw new Error(body?.error ?? "request failed")
    }

    return body;
  }

  const onDeleteAcara = (id: string) => {
    if (!id) return toast.error("id tidak boleh kosong")
    setIsPosting(true)

    toast.promise(
      deleteAcara(id).then(() => {
        startTransition(() => {
          router.refresh();
        });
        setIsPosting(false);
        setShowModal({ show: false, type: "add" });
      }), {
      pending: "Menghapus acara...",
      success: "Berhasil hapus acara",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return "Request failed"
        }
      }
    })
  }

  const handleSelectSlot = (start: any, end: any) => {
    setEventForm({ title: "", start: start, end: end });
    setShowModal({ show: true, type: "add" });
  };

  const handleSelectEvent = (event: EventData) => {
    setEditingId(event.id)
    setEventForm({ title: event.title, start: event.start, end: event.end })
    setShowModal({ show: true, type: "edit" });
  }

  useEffect(() => {
    setEvents(data);
  }, [data])

  return (
    <>
      <LoadingScreen show={isPending} />
      <div style={{ height: "80vh" }}>
        <Calendar
          selectable
          localizer={localizer}
          culture="id-ID"
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          onSelectSlot={(slotInfo) => { handleSelectSlot(slotInfo.start, slotInfo.end) }}
          onSelectEvent={(event) => handleSelectEvent(event)}
        />
      </div>
      <Modal show={showModal.show} onHide={onModalClose} className="p-0">
        <Form onSubmit={(e) => onSubmit(eventForm, e)}>
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
              {showModal.type === "edit" ? <Button type="button" variant="danger" onClick={() => onDeleteAcara(editingId)} disabled={isPosting && true}>Hapus</Button> : <div></div>}
              <Stack direction="horizontal" gap={2}>
                <Button type="button" variant="warning" onClick={onModalClose}>Batal</Button>
                <Button type="submit" variant="primary" disabled={isPosting && true}>{showModal.type === "edit" ? "Update" : "Submit"}</Button>
              </Stack>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ClientPage