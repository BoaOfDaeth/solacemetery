export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Use a more stable date formatting that works consistently on server and client
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  // Use UTC to avoid timezone issues
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const utcHours = utcDate.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${utcHours}:${utcMinutes} UTC`;
}
