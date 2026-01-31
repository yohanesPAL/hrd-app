interface EventForm {
  akun_id: string;
  title: string;
  start: Date;
  end: Date;
}

interface EventData extends EventForm {
  id: string;
}