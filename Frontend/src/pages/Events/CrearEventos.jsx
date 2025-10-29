import { useMemo, useState } from "react";
import { BackButton } from "../../components/Common/BackButton.jsx";
import { useEvents } from "../../context/events/eventsContext";

import {
  EventField as Field,
  EventFieldArea as FieldArea,
  EventFieldSelect as FieldSelect,
  EventFieldToggle as FieldToggle,
  EventRow as Row,
  EventSectionTitle as SectionTitle,
} from "./components/EventFormFields.jsx";
import {
  calculateDurationMinutes,
  createEmptyEventForm,
  normalizeEventPayload,
  validateEventForm,
} from "./utils/eventFormUtils.js";

const STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "cancelled", label: "Cancelado" },
];

const BASIC_FIELDS = [
  {
    id: "title",
    label: "Titulo",
    placeholder: "Ej: Observacion de estrellas",
    required: true,
  },
  {
    id: "organizer",
    label: "Organizador",
    placeholder: "Ej: Fundacion Astromania",
    required: true,
  },
];

export function CrearEventos() {
  const { createOneEvent, loading, error } = useEvents();

  const [form, setForm] = useState(() => createEmptyEventForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const durationMinutes = useMemo(
    () => calculateDurationMinutes(form.startDateTime, form.endDateTime),
    [form.startDateTime, form.endDateTime]
  );

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errors: validationErrors, isValid } = validateEventForm(form, {
      requireOnlineUrl: true,
    });
    setErrors(validationErrors);
    if (!isValid) return;

    try {
      setSubmitting(true);
      const payload = normalizeEventPayload(form);
      await createOneEvent(payload);
      alert("Evento creado.");
      setForm(createEmptyEventForm());
      setErrors({});
    } catch (submitError) {
      alert(submitError?.message || "Error al crear el evento");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mt-15 max-w-4xl mx-auto px-4 pb-28 pt-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Crear evento</h1>
        <BackButton fallback="/admin/eventos/editar" />
      </header>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card bg-base-100/70 border border-base-200 shadow-sm">
          <div className="card-body space-y-5 p-5">
            <SectionTitle
              icon="B"
              title="Informacion basica"
              subtitle="Nombre, organizacion y una breve descripcion del evento."
            />

            <div className="space-y-4">
              {BASIC_FIELDS.map(({ id, label, placeholder, required }) => (
                <Field
                  key={id}
                  id={id}
                  name={id}
                  label={label}
                  value={form[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  error={errors[id]}
                />
              ))}

              <FieldArea
                id="description"
                name="description"
                label="Descripcion"
                value={form.description}
                onChange={handleChange}
                placeholder="Cuenta en pocas lineas de que trata tu evento."
                hint="Minimo 10 caracteres."
                required
                error={errors.description}
              />
            </div>
          </div>
        </section>

        <section className="card bg-base-100/70 border border-base-200 shadow-sm">
          <div className="card-body space-y-5 p-5">
            <SectionTitle
              icon="M"
              title="Modalidad y referencia"
              subtitle="Define si es presencial u online y agrega enlaces utiles."
            />

            <div className="space-y-4">
              <Field
                id="location"
                name="location"
                label="Lugar"
                value={form.location}
                onChange={handleChange}
                placeholder={
                  form.isOnline
                    ? "Si queda vacio se guardara como Online"
                    : "Ej: Centro Cultural de Santiago"
                }
                hint="Especifica si es presencial."
              />

              <FieldToggle
                label="Modalidad"
                checked={form.isOnline}
                onChange={(event) =>
                  handleChange({
                    target: {
                      name: "isOnline",
                      type: "checkbox",
                      checked: event.target.checked,
                    },
                  })
                }
                textRight="Evento online"
              />

              <Field
                id="url"
                name="url"
                label="URL de referencia"
                value={form.url}
                onChange={handleChange}
                placeholder="https://tusitio.com/evento/123"
                hint="Pagina del evento, formulario, etc. (opcional)"
                type="url"
                error={errors.url}
              />

              
{form.isOnline &&(
              <Field
                id="urlOnline"
                name="urlOnline"
                label="URL evento online"
                value={form.urlOnline}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                hint="Obligatorio si el evento es online."
                type="url"
                error={errors.urlOnline}
              />)}
            </div>
          </div>
        </section>

        <section className="card bg-base-100/70 border border-base-200 shadow-sm">
          <div className="card-body space-y-5 p-5">
            <SectionTitle
              icon="F"
              title="Fechas y duracion"
              subtitle="Configura inicio, termino y revisa la duracion estimada."
            />

            <div className="space-y-4">
              <Row label="Inicio" htmlFor="startDateTime">
                <div className="form-control">
                  <input
                    id="startDateTime"
                    name="startDateTime"
                    type="datetime-local"
                    className={`${
                      errors.startDateTime ? "input-error" : ""
                    } ${"w-full input input-bordered input-sm rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"}`}
                    value={form.startDateTime}
                    onChange={handleChange}
                    required
                  />
                  {errors.startDateTime && (
                    <span className="text-error text-xs mt-1">
                      {errors.startDateTime}
                    </span>
                  )}
                </div>
              </Row>

              <Row label="Termino" htmlFor="endDateTime">
                <div className="form-control">
                  <input
                    id="endDateTime"
                    name="endDateTime"
                    type="datetime-local"
                    className={`${
                      errors.endDateTime ? "input-error" : ""
                    } ${"w-full input input-bordered input-sm rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"}`}
                    value={form.endDateTime}
                    min={form.startDateTime || undefined}
                    onChange={handleChange}
                    required
                  />
                  {errors.endDateTime && (
                    <span className="text-error text-xs mt-1">
                      {errors.endDateTime}
                    </span>
                  )}
                </div>
              </Row>

              <Row label="Duracion">
                <div className="text-sm opacity-80">
                  {durationMinutes ? (
                    <span className="badge badge-ghost">
                      {`~ ${durationMinutes} min`}
                    </span>
                  ) : (
                    "Define inicio y termino para calcular la duracion."
                  )}
                </div>
              </Row>
            </div>
          </div>
        </section>

        <section className="card bg-base-100/70 border border-base-200 shadow-sm">
          <div className="card-body space-y-5 p-5">
            <SectionTitle
              icon="I"
              title="Inscripcion y visibilidad"
              subtitle="Controla precio, cupos y estado publico del evento."
            />

            <div className="space-y-4">
              <FieldToggle
                label="Inscripcion"
                checked={form.requiresRegistration}
                onChange={(event) =>
                  handleChange({
                    target: {
                      name: "requiresRegistration",
                      type: "checkbox",
                      checked: event.target.checked,
                    },
                  })
                }
                textRight="Requiere inscripcion"
              />

              <Field
                id="price"
                name="price"
                label="Precio (CLP)"
                value={form.price}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder="0 = gratuito"
                error={errors.price}
              />

              <Field
                id="capacity"
                name="capacity"
                label="Cupos"
                value={form.capacity}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder="Vacio = sin limite"
                error={errors.capacity}
              />

              <FieldSelect
                id="status"
                name="status"
                label="Estado"
                value={form.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </FieldSelect>
            </div>
          </div>
        </section>

        <section className="card bg-base-100/70 border border-base-200 shadow-sm">
          <div className="card-body space-y-5 p-5">
            <SectionTitle
              icon="T"
              title="Etiquetas"
              subtitle="Ayuda a tu audiencia a encontrar tu evento."
            />

            <Field
              id="tags"
              name="tags"
              label="Tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="astronomia, taller, familiar"
              hint="Usa 2-5 tags relevantes (separados por coma)."
            />
          </div>
        </section>

        <div className="btm-nav md:static md:btm-nav-none md:flex md:justify-end md:gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm md:btn-md"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm md:btn-md"
            disabled={submitting || loading}
          >
            {submitting || loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Creando...
              </span>
            ) : (
              "Crear evento"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
