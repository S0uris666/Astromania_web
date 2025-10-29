const URL_REGEX = /^https?:\/\/.{3,}/i;

const DEFAULT_FORM = {
  title: "",
  description: "",
  organizer: "",
  location: "",
  startDateTime: "",
  endDateTime: "",
  requiresRegistration: false,
  price: "",
  capacity: "",
  tags: "",
  isOnline: false,
  url: "",
  status: "draft",
  urlOnline: "",
};

const pad2 = (value) => String(value).padStart(2, "0");

export function createEmptyEventForm(overrides = {}) {
  return { ...DEFAULT_FORM, ...overrides };
}

export function toISODateTime(localDateTime) {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function toLocalInput(isoDateTime) {
  if (!isoDateTime) return "";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function calculateDurationMinutes(start, end) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  if (
    Number.isNaN(startMs) ||
    Number.isNaN(endMs) ||
    endMs <= startMs
  ) {
    return null;
  }
  return Math.round((endMs - startMs) / 60000);
}

export function populateFormFromEvent(event) {
  if (!event) {
    return createEmptyEventForm();
  }

  const tags =
    Array.isArray(event.tags) && event.tags.length > 0
      ? event.tags.join(", ")
      : event.tags || "";

  return createEmptyEventForm({
    title: event.title || "",
    description: event.description || "",
    organizer: event.organizer || "",
    location: event.location || "",
    startDateTime: toLocalInput(event.startDateTime),
    endDateTime: toLocalInput(event.endDateTime),
    requiresRegistration: !!event.requiresRegistration,
    price:
      event.price === 0 || event.price
        ? String(event.price)
        : "",
    capacity:
      event.capacity === 0 || event.capacity
        ? String(event.capacity)
        : "",
    tags,
    isOnline: !!event.isOnline,
    url: event.url || "",
    status: event.status || "draft",
    urlOnline: event.urlOnline || "",
  });
}

const numberOrDefault = (value, defaultValue) => {
  if (value === "" || value === null || value === undefined) {
    return defaultValue;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const sameCalendarDate = (a, b) => {
  if (!a || !b) return false;
  const start = new Date(a);
  const end = new Date(b);
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
};

export function normalizeEventPayload(form) {
  const trimmedLocation = (form.location || "").trim();
  const normalizedTags = Array.isArray(form.tags)
    ? form.tags
    : String(form.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const payload = {
    title: (form.title || "").trim(),
    description: (form.description || "").trim(),
    organizer: (form.organizer || "").trim(),
    location:
      form.isOnline && !trimmedLocation
        ? "Online"
        : trimmedLocation,
    startDateTime: toISODateTime(form.startDateTime),
    endDateTime: toISODateTime(form.endDateTime),
    requiresRegistration: !!form.requiresRegistration,
    price: numberOrDefault(form.price, 0),
    capacity: numberOrDefault(form.capacity, null),
    tags: normalizedTags,
    isOnline: !!form.isOnline,
    url: (form.url || "").trim(),
    status: form.status || "draft",
  };

  if (Object.prototype.hasOwnProperty.call(form, "urlOnline")) {
    payload.urlOnline = (form.urlOnline || "").trim();
  }

  return payload;
}

export function validateEventForm(
  form,
  { requireOnlineUrl = true } = {}
) {
  const errors = {};

  if (!form.title || form.title.trim().length < 3) {
    errors.title = "Minimo 3 caracteres.";
  }
  if (!form.description || form.description.trim().length < 10) {
    errors.description = "Minimo 10 caracteres.";
  }
  if (!form.organizer || form.organizer.trim().length < 3) {
    errors.organizer = "Minimo 3 caracteres.";
  }
  if (!form.startDateTime) {
    errors.startDateTime = "Requerido.";
  }
  if (!form.endDateTime) {
    errors.endDateTime = "Requerido.";
  }

  if (form.startDateTime && form.endDateTime) {
    const start = new Date(form.startDateTime);
    const end = new Date(form.endDateTime);
    const startMs = start.getTime();
    const endMs = end.getTime();
    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      errors.endDateTime = "Fecha u hora invalida.";
    } else if (endMs <= startMs) {
      errors.endDateTime = sameCalendarDate(
        form.startDateTime,
        form.endDateTime
      )
        ? "Misma fecha permitida, pero la hora de termino debe ser posterior."
        : "La fecha y hora de termino debe ser posterior a la de inicio.";
    }
  }

  if (form.price !== "" && Number(form.price) < 0) {
    errors.price = "No puede ser negativo.";
  }

  if (form.capacity !== "" && Number(form.capacity) < 0) {
    errors.capacity = "No puede ser negativo.";
  }

  if (form.url && !URL_REGEX.test(form.url.trim())) {
    errors.url =
      "URL invalida. Ejemplo: https://ejemplo.com/evento";
  }

  if (
    requireOnlineUrl &&
    Object.prototype.hasOwnProperty.call(form, "urlOnline") &&
    form.isOnline
  ) {
    const trimmed = (form.urlOnline || "").trim();
    if (!trimmed) {
      errors.urlOnline = "Ingresa la URL del evento online.";
    } else if (!URL_REGEX.test(trimmed)) {
      errors.urlOnline =
        "URL online invalida. Ejemplo: https://zoom.us/j/...";
    }
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

