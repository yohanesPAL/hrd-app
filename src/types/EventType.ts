interface EventForm {
  title: string;
  start: Date;
  end: Date;
}

interface EventData extends EventForm {
  id: string;
}