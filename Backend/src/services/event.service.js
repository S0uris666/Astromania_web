import Event from "../models/Event.model.js";
import { buildEventsCalendar } from "../config/calendar.js";
import { sanitizePayload } from "../utils/utils.js";

const ADMIN_ROLE = "admin";
const SUPER_ROLE = "superuser";
const USER_STATUS_FILTER = ["published", "draft", "cancelled"];
const PUBLIC_STATUSES = ["published", "cancelled"];

const isAdmin = (user) =>
  String(user?.role || "").toLowerCase() === ADMIN_ROLE;

const isSuperUser = (user) =>
  String(user?.role || "").toLowerCase() === SUPER_ROLE;

const buildStatusFilter = (status, allowed) =>
  allowed.includes(status) ? { status } : {};

export const listEventsForUser = async (user, status) => {
  const baseFilter = isAdmin(user) ? {} : { createdBy: user.id };
  const normalizedStatus = String(status || "").toLowerCase();
  const statusFilter = buildStatusFilter(normalizedStatus, USER_STATUS_FILTER);
  return Event.find({ ...baseFilter, ...statusFilter })
    .sort({ startDateTime: 1 })
    .populate({ path: "createdBy", select: "username email role" });
};

export const listPublicEvents = async (status) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const statusFilter = buildStatusFilter(normalizedStatus, PUBLIC_STATUSES);
  const filter =
    Object.keys(statusFilter).length > 0
      ? statusFilter
      : { status: { $in: PUBLIC_STATUSES } };

  return Event.find(filter).sort({ startDateTime: 1 });
};

export const findEventById = (id) => Event.findById(id);

export const ensureEventOwnership = (eventDoc, user) => {
  if (isAdmin(user)) return true;
  if (
    isSuperUser(user) &&
    eventDoc?.createdBy?.toString() === String(user.id)
  ) {
    return true;
  }
  return false;
};

export const createEventForUser = async (payload, user) => {
  const { title, startDateTime, endDateTime, location } = payload || {};

  const duplicate = await Event.findOne({
    title,
    startDateTime,
    endDateTime,
    location,
  });

  if (duplicate) {
    return { error: "Ya existe un evento con el mismo titulo, fecha y lugar." };
  }

  const sanitized = sanitizePayload({
    ...payload,
    createdBy: user.id,
  });

  const created = await Event.create(sanitized);
  return { event: created };
};

export const updateEventById = async (id, changes) => {
  const sanitized = sanitizePayload(changes);
  return Event.findByIdAndUpdate(id, sanitized, {
    new: true,
  });
};

export const deleteEventById = async (id) => Event.findByIdAndDelete(id);

export const buildCalendarFeed = async (baseUrl) => {
  const events = await Event.find({ status: "published" })
    .sort({ startDateTime: 1 })
    .lean();

  return buildEventsCalendar(events, {
    baseUrl,
  });
};

