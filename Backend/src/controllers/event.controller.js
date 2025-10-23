import Event from "../models/Event.model.js";

export const getAllEvents = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    const isAdmin = role === "admin";
    const isSuper = role === "superuser";

    // filtro principal: admin ve todo; otros solo propios
    const baseFilter = isAdmin ? {} : { createdBy: req.user.id };

    // filtro opcional por status ?status=published|draft|cancelled
    const { status } = req.query;
    const filter = { ...baseFilter };
    if (status && ["published", "draft", "cancelled"].includes(status)) {
      filter.status = status;
    }

    // trae todo (published/draft/cancelled según filtro)
    const events = await Event.find(filter)
      .sort({ startDateTime: 1 })                 // o { createdAt: -1 }
      .populate({ path: "createdBy", select: "username email role" }); // opcional

    res.status(200).json(events);
  } catch (error) {
    console.error("getAllEvents error:", error);
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, startDateTime, endDateTime, location } =
      req.body;
    const existingEvent = await Event.findOne({
      title,
      startDateTime,
      endDateTime,
      location
    });

    if (existingEvent) {
      return res.status(400).json({
        error: "Ya existe un evento con el mismo título, fecha y lugar.",
      });
    }

    const newEvent = await Event.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    // Buscamos solo por _id, no usamos populate
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    return res.status(200).json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evento no encontrado" });

    if (
      req.user.role === "admin" ||
      (req.user.role === "superuser" &&
        event.createdBy.toString() === req.user.id.toString())
    ) {
      await Event.findByIdAndDelete(req.params.id);
      return res.json({ message: "Evento eliminado correctamente" });
    }

    return res
      .status(403)
      .json({ message: "No tienes permisos para eliminar este evento" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evento no encontrado" });

    // Admin puede todo
    if (req.user.role === "admin") {
      const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.json(updated);
    }

    // Superuser solo puede editar lo que creó
    if (
      req.user.role === "superuser" &&
      event.createdBy.toString() === req.user.id.toString()
    ) {
      const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.json(updated);
    }

    return res
      .status(403)
      .json({ message: "No tienes permisos para editar este evento" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rutas públicas (sin auth, cualquiera puede usarlas)


// Obtener todos los eventos (público, sin auth)
export const getAllPublicEvents = async (req, res) => {
  try {
    const allowedStatuses = ["published", "cancelled"];
    const requestedStatus = String(req.query?.status || "").toLowerCase();
    const filter = requestedStatus && allowedStatuses.includes(requestedStatus)
      ? { status: requestedStatus }
      : { status: { $in: allowedStatuses } };
    const events = await Event.find(filter).sort({ startDateTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos publicos" });
  }
};

// Obtener un evento por id (público, sin auth)
export const getPublicEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const allowedStatuses = ["published", "cancelled"];
    const currentStatus = String(event?.status || "").toLowerCase();
    if (!event || !allowedStatuses.includes(currentStatus)) {
      return res.status(404).json({ message: "Evento no encontrado o no disponible" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


