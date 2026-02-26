export function formatDateDDMMYYYY(date: Date | null) {
  if(!date) return ""

  return new Intl.DateTimeFormat("id-ID").format(date);
}

export function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}