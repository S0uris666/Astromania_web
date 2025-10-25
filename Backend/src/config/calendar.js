import ical from "ical-generator";

const DEFAULT_TIMEZONE = "America/Santiago";
const DEFAULT_BASE_URL = "https://astromania-web-nsgx.vercel.app";


const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildEventsCalendar = (events = [], options = {}) => {
  const {
    calendarName = "Astromania - Eventos",
    calendarDescription = "Eventos publicados de Astromania",
    baseUrl = process.env.PUBLIC_SITE_URL,
    timezone = DEFAULT_TIMEZONE,
  } = options;

  const sanitizedBaseUrl = trimTrailingSlash(baseUrl || DEFAULT_BASE_URL);

  const calendar = ical({
    name: calendarName,
    description: calendarDescription,
    timezone,
    prodId: { company: "Astromania", product: "CalendarFeed", language: "ES" },
    method: "PUBLISH",
  });

  if (typeof calendar.timezone === "function") {
    try {
      calendar.timezone(timezone);
    } catch {
      /* fallback silently if timezone helper is unavailable */
    }
  }

  events.forEach((ev) => {
    const start = toDateOrNull(ev?.startDateTime);
    if (!start) return;

    const end = toDateOrNull(ev?.endDateTime);

    const eventConfig = {
      id: String(ev._id),
      start,
      summary: ev.title || "Evento sin titulo",
      timezone,
    };

    if (end) eventConfig.end = end;
    if (ev?.description) eventConfig.description = ev.description;

    if (ev?.isOnline) {
      eventConfig.location = "Online";
    } else if (ev?.location) {
      eventConfig.location = ev.location;
    }

    const publicUrl =
      ev?.urlOnline ||
      ev?.url ||
      (ev?.slug ? `${sanitizedBaseUrl}/evento/${ev.slug}` : `${sanitizedBaseUrl}/evento/${ev?._id}`);

    if (publicUrl) {
      eventConfig.url = publicUrl;
    }

    calendar.createEvent(eventConfig);
  });

  return calendar;
};
