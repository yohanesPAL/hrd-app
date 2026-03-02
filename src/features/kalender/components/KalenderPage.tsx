'use client'
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import useProfile from "@/stores/profile/profile.store";
import { AccountId, BaseEvent, EventForm } from "@/modules/event/event.schema";
import { EventModal } from "../types/KalenderTypes";
import KalenderForm from "./KalenderForm";
import { useExecuteAction } from "@/hooks/useExecuteAction";
import { createEvent, deleteEvent, updateEvent } from "../KalendarAction";

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

const eventDefault: EventForm = { akun_id: "", title: "", start: new Date(), end: new Date() }

const KalenderPage = ({ events }: { events: BaseEvent[] }) => {
  const router = useRouter()
  const today = new Date();
  const userId: string = useProfile((state) => state.profile?.id)!
  const [showModal, setShowModal] = useState<EventModal>({ show: false, type: "add" });
  const [eventForm, setEventForm] = useState<EventForm>(eventDefault)
  const [editingId, setEditingId] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { executeAction } = useExecuteAction();

  const onModalClose = () => {
    setShowModal({ show: false, type: "add" });
    setEventForm(eventDefault);
    setEditingId("");
  }

  const getAcara = async (date: Date) => {
    setIsLoading(true);

    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    router.push(`?month=${month}`);
    setCurrentDate(date);
  }

  const postEvent = async (data: EventForm) => {
    await toast.promise(
      executeAction(createEvent, data), {
      pending: "Membuat acara...",
      success: "Berhasil buat acara",
      error: "Ooops... ada yang salah",
    }
    )
  }

  const patchEvent = async (id: string, data: EventForm) => {
    await toast.promise(
      executeAction(updateEvent, data, id), {
      pending: "Update acara...",
      success: "Berhasil update acara",
      error: "Ooops... ada yang salah",
    }
    )
  }

  const onSubmit = async (payload: EventForm) => {
    if (!payload) return toast.error("data tidak boleh kosong");
    setIsPosting(true);

    if (showModal.type === "add") {
      await postEvent(payload);
    } else if (showModal.type === "edit") {
      await patchEvent(editingId, payload);
    }

    setIsPosting(false);
    onModalClose();
  }

  const onDeleteAcara = async(id: string) => {
    if (!id) return toast.error("id tidak boleh kosong")
    setIsPosting(true);

    await toast.promise(
      executeAction(deleteEvent, id), {
      pending: "Menghapus acara...",
      success: "Berhasil hapus acara",
      error: "Ooops... ada yang salah",
    })

    setIsPosting(false);
    onModalClose();
  }

  const handleSelectSlot = (start: any, end: any) => {
    setEventForm({ akun_id: userId, title: "", start: start, end: end });
    setShowModal({ show: true, type: "add" });
  };

  const handleSelectEvent = (event: BaseEvent) => {
    setEditingId(event.id)
    setEventForm({ akun_id: userId, title: event.title, start: event.start, end: event.end })
    setShowModal({ show: true, type: "edit" });
  }

  useEffect(() => {
    setIsLoading(false);
  }, [events])

  return (
    <>
      <LoadingScreen show={isLoading} />
      <div style={{ height: "80vh" }}>
        <Calendar
          date={currentDate}
          view={currentView}
          selectable
          localizer={localizer}
          culture="id-ID"
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          onView={(view) => setCurrentView(view)}
          onNavigate={(date, view) => {
            setCurrentView(view)
            getAcara(date);
          }}
          onSelectSlot={(slotInfo) => { handleSelectSlot(slotInfo.start, slotInfo.end) }}
          onSelectEvent={(event) => handleSelectEvent(event)}
          eventPropGetter={(event) => {
            let backgroundColor = '#3174ad'
            if (event.end < today) {
              backgroundColor = 'gray'
            } else if (event.start <= today && event.end >= today) {
              backgroundColor = '#31ad46'
            }

            return {
              style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
              },
            };
          }}
        />
      </div>
      <Stack className="my-4">
        <span>status:</span>
        <Stack direction='horizontal' gap={1}>
          <span className="px-1 rounded" style={{ background: "gray", color: "white" }}>Sudah Lewat</span>
          <span>|</span>
          <span className="px-1 rounded" style={{ background: "#31ad46", color: "white" }}>Berlangsung</span>
          <span>|</span>
          <span className="px-1 rounded" style={{ background: "#3174ad", color: "white" }}>Mendatang</span>
        </Stack>
      </Stack>

      <KalenderForm
        showModal={showModal}
        onModalClose={onModalClose}
        onSubmit={onSubmit}
        eventForm={eventForm}
        setEventForm={setEventForm}
        isPosting={isPosting}
        onDeleteAcara={onDeleteAcara}
        eventId={editingId}
      />
    </>
  )
}

export default KalenderPage