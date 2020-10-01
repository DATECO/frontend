function parseDate(t) {
  let day = t.getDate();
  let month = t.getMonth()+1;
  let hour = t.getHours();
  let minutes = t.getMinutes();
  minutes = minutes - (minutes%10);
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  const date = `${t.getFullYear()}-${month}-${day}`;
  const time = `${hour}:${minutes}`;
  return [date,time];
}

export default parseDate;