import {
  listEventsForUser,
  createEventForUser,
  findEventById,
  deleteEventById,
  updateEventById,
  ensureEventOwnership,
  listPublicEvents,
  buildCalendarFeed,
} from "../services/event.service.js";
import { sendSuccess, sendError } from "../utils/utils.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await listEventsForUser(req.user, req.query.status);
    return sendSuccess(res, events);
  } catch (error) {
    console.error("getAllEvents error:", error);
    return sendError(res, 500, "Error al obtener los eventos");
  }
};

export const createEvent = async (req, res) => {
  try {
    const result = await createEventForUser(req.body, req.user);

    if (result.error) {
      return sendError(res, 400, result.error);
    }

    return sendSuccess(res, result.event, 201);
  } catch (err) {
    console.error("createEvent error:", err);
    return sendError(res, 500, err.message);
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      return sendError(res, 404, "Evento no encontrado");
    }
    return sendSuccess(res, { event });
  } catch (err) {
    console.error("getEventById error:", err);
    return sendError(res, 500, err.message);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      return sendError(res, 404, "Evento no encontrado");
    }

    if (!ensureEventOwnership(event, req.user)) {
      return sendError(res, 403, "No tienes permisos para eliminar este evento");
    }

    await deleteEventById(req.params.id);
    return sendSuccess(res, { message: "Evento eliminado correctamente" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return sendError(res, 500, err.message);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await findEventById(req.params.id);
    if (!event) {
      return sendError(res, 404, "Evento no encontrado");
    }

    if (!ensureEventOwnership(event, req.user)) {
      return sendError(res, 403, "No tienes permisos para editar este evento");
    }

    const updated = await updateEventById(req.params.id, req.body);
    return sendSuccess(res, updated);
  } catch (err) {
    console.error("updateEvent error:", err);
    return sendError(res, 500, err.message);
  }
};

export const getAllPublicEvents = async (req, res) => {
  try {
    const events = await listPublicEvents(req.query?.status);
    return sendSuccess(res, events);
  } catch (error) {
    console.error("getAllPublicEvents error:", error);
    return sendError(res, 500, "Error al obtener los eventos publicos");
  }
};

export const getPublicEventById = async (req, res) => {
  try {
    const event = await findEventById(req.params.id);
    const allowedStatuses = ["published", "cancelled"];
    const currentStatus = String(event?.status || "").toLowerCase();
    if (!event || !allowedStatuses.includes(currentStatus)) {
      return sendError(res, 404, "Evento no encontrado o no disponible");
    }
    return sendSuccess(res, event);
  } catch (error) {
    console.error("getPublicEventById error:", error);
    return sendError(res, 500, error.message);
  }
};

export const getEventsCalendarFeed = async (req, res) => {
  try {
    const calendar = await buildCalendarFeed(process.env.PUBLIC_SITE_URL);

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="astromania-events.ics"'
    );
    res.send(calendar.toString());
  } catch (error) {
    console.error("getEventsCalendarFeed error:", error);
    return sendError(res, 500, "No se pudo generar el calendario iCal");
  }
};

