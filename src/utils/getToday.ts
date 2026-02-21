function getTodayDDMMYY() {
  const today = new Date();

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(-2);

  return `${dd}${mm}${yy}`;
}

function getTodayYYYYMMDD() {
  return new Date().toLocaleDateString("en-CA");
}

export { getTodayDDMMYY, getTodayYYYYMMDD };
