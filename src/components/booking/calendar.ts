import { SITE_CONFIG } from "@/lib/constants";

interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  durationDays: number;
}

function formatIcsDate(date: string): string {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function buildIcsDataUri(event: IcsEvent): string {
  const start = formatIcsDate(event.startDate);
  const endDate = new Date(event.startDate);
  endDate.setUTCDate(endDate.getUTCDate() + event.durationDays);
  const end = formatIcsDate(endDate.toISOString());
  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const desc = event.description.replace(/\n/g, "\\n");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Traverse Pakistan//Tour Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${event.location}`,
    `ORGANIZER;CN=${SITE_CONFIG.name}:mailto:${SITE_CONFIG.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export function googleCalendarLink(event: IcsEvent): string {
  const start = formatIcsDate(event.startDate);
  const endDate = new Date(event.startDate);
  endDate.setUTCDate(endDate.getUTCDate() + event.durationDays);
  const end = formatIcsDate(endDate.toISOString());
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
