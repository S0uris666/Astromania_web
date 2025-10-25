import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
  getAllPublicEvents,
  getPublicEventById,
  getEventsCalendarFeed,
} from "../controllers/event.controller.js";
import auth from "../middlewares/auth.js";
import { authRol } from "../middlewares/authRol.js";

const eventRouter = Router();

// Rutas publicas (sin auth, cualquiera puede usarlas)
eventRouter.get("/events/feed.ics", getEventsCalendarFeed); // Feed iCal de eventos publicados
eventRouter.get("/events/readall", getAllPublicEvents); // Listar todos los eventos
eventRouter.get("/event/read/:id", getPublicEventById); // Ver detalle de un evento

// Rutas privadas (requieren auth y rol)
eventRouter.get("/user/events/readall", auth, authRol("superuser", "admin"), getAllEvents); // Listar todos los eventos (privado)
eventRouter.post("/user/event/create", auth, authRol("superuser", "admin"), createEvent);
eventRouter.put("/user/event/update/:id", auth, authRol("superuser", "admin"), updateEvent);
eventRouter.delete("/user/event/delete/:id", auth, authRol("superuser", "admin"), deleteEvent);
eventRouter.get("/user/event/read/:id", auth, authRol("superuser", "admin"), getEventById); // Ver detalle de un evento (privado)

export default eventRouter;

