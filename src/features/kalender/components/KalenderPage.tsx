'use client'
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import useProfile from "@/stores/profile/profile.store";
import { BaseEvent, EventForm } from "@/modules/event/event.schema";
import KalenderForm from "./KalenderForm";
import { createEventAction, deleteEventAction, updateEventAction } from "../KalendarAction";
import { useActionHandler } from "@/hooks/useActionHandler";

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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [eventForm, setEventForm] = useState<EventForm>(eventDefault)
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  const { run, isPending } = useActionHandler()

  const onModalClosed = () => {
    setShowModal(false);
    setEventForm(eventDefault);
    setSelectedEvent("");
  }

  const getAcara = async (date: Date) => {
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    router.push(`?month=${month}`);
    setCurrentDate(date);
  }

  const createEvent = async () => {
    await run(createEventAction, [eventForm], {
      toast: {
        pending: "Membuat acara...",
        success: "Berhasil buat acara",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const updateEvent = async () => {
    await run(updateEventAction, [eventForm, selectedEvent], {
      toast: {
        pending: "Update acara...",
        success: "Berhasil update acara",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    if (selectedEvent === "") await createEvent();
    else await updateEvent();

    onModalClosed();
  }

  const deleteEvent = async (id: string) => {
    if (!id) return toast.error("id tidak boleh kosong");

    await run(deleteEventAction, [id], {
      toast: {
        pending: "Menghapus acara...",
        success: "Berhasil hapus acara",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })

    onModalClosed();
  }

  const handleSelectSlot = (start: any, end: any) => {
    setEventForm({ akun_id: userId, title: "", start: start, end: end });
    setShowModal(true);
  };

  const handleSelectEvent = (event: BaseEvent) => {
    setSelectedEvent(event.id)
    setEventForm({ akun_id: userId, title: event.title, start: event.start, end: event.end })
    setShowModal(true);
  }

  return (
    <>
      <LoadingScreen show={isPending} />
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
        modal={{ show: showModal, onClosed: onModalClosed }}
        event={{
          selected: selectedEvent,
          form: eventForm,
          setForm: setEventForm,
          onSubmit: onSubmit,
          onDelete: deleteEvent
        }}
        isPending={isPending}
      />
    </>
  )
}

export default KalenderPage