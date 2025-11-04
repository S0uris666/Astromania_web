import { useMemo } from "react";
import { Mail, User, MapPin, Briefcase, Stars, Info } from "lucide-react";

const ProfileForm = ({ values = {}, onFieldChange, errors = {} }) => {
  const v = useMemo(
    () => ({
      username: values.username || "",
      email: values.email || "",
      publicEmail: values.publicEmail || "",
      status: values.status || "published",
      profesion: values.profesion || "",
      especializacion: values.especializacion || "",
      city: values.city || "",
      description: values.description || "",
    }),
    [values]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    onFieldChange?.(name, value);
  };

  const descCount = v.description.length;
  const descMax = 1000;
  const descMin = 10;
  const pct = Math.min(100, Math.round((descCount / descMax) * 100));
  const barClass =
    pct < 70 ? "progress-primary" : pct < 90 ? "progress-warning" : "progress-error";
  const descTooShort = descCount > 0 && descCount < descMin;
  const progressClass = descTooShort ? "progress-error" : barClass;

  const iconDefaults = { size: 18, strokeWidth: 1.6 };
  const fieldIconClass =
    "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60";

  return (
    <section className="card bg-base-100 border border-base-300/60 shadow-sm">
      <div className="card-body p-5 sm:p-6 lg:p-8">
        <header className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Info size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="card-title text-lg sm:text-xl">Informacion profesional</h2>
            <p className="text-sm text-base-content/70">
              Completa tu perfil para que la comunidad pueda encontrarte y contactarte.
            </p>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Nombre</span>
            </div>
            <div className="relative">
              <User {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="text"
                name="username"
                value={v.username}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Tu nombre de perfil"
                autoComplete="name"
                maxLength={80}
                required
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "err-username" : undefined}
              />
            </div>
            {errors.username ? (
              <span id="err-username" className="label-text-alt text-error">
                {errors.username}
              </span>
            ) : null}
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Correo registrado</span>
            </div>
            <div className="relative">
              <Mail {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="email"
                value={v.email}
                readOnly
                disabled
                className="input input-bordered w-full pl-9 bg-base-300/30 cursor-not-allowed text-base-content/70"
                placeholder="Correo con el que te registraste"
                aria-readonly="true"
              />
            </div>
            <span className="label-text-alt text-xs text-base-content/60">
              Este correo es parte de tu cuenta y no se puede editar.
            </span>
          </label>

          <label className="form-control w-full md:col-span-2">
            <div className="label">
              <span className="label-text">Correo publico</span>
            </div>
            <div className="relative">
              <Mail {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="email"
                name="publicEmail"
                value={v.publicEmail}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Tu email de contacto publico"
                autoComplete="email"
                inputMode="email"
                aria-invalid={!!errors.publicEmail}
                aria-describedby={errors.publicEmail ? "err-publicEmail" : undefined}
              />
            </div>
            <div className="label">
              <span className="label-text-alt text-xs text-base-content/60">
                Se mostrara en tu tarjeta. Si lo dejas vacio, se usara tu correo de cuenta.
              </span>
              {errors.publicEmail ? (
                <span id="err-publicEmail" className="label-text-alt text-error">
                  {errors.publicEmail}
                </span>
              ) : null}
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Visibilidad del perfil</span>
            </div>
            <select
              name="status"
              value={v.status}
              onChange={handleChange}
              className="select select-bordered w-full"
              aria-label="Visibilidad del perfil"
            >
              <option value="published">Visible para la comunidad</option>
              <option value="draft">Oculto (modo borrador)</option>
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Profesion</span>
            </div>
            <div className="relative">
              <Briefcase {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="text"
                name="profesion"
                value={v.profesion}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Astrofisico/a, divulgador/a, educador/a..."
                maxLength={80}
              />
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Especializacion</span>
            </div>
            <div className="relative">
              <Stars {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="text"
                name="especializacion"
                value={v.especializacion}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Cosmologia, Observacion, Educacion..."
                maxLength={120}
              />
            </div>
            <span className="label-text-alt text-xs text-base-content/60">
              Puedes separar varias con comas.
            </span>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Ciudad</span>
            </div>
            <div className="relative">
              <MapPin {...iconDefaults} className={fieldIconClass} aria-hidden="true" />
              <input
                type="text"
                name="city"
                value={v.city}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Valparaiso, Santiago, Concepcion..."
                maxLength={80}
              />
            </div>
          </label>

          <label className="form-control w-full md:col-span-2">
            <div className="label justify-between">
              <span className="label-text">Descripcion</span>
              <span
                className={`label-text-alt ${
                  descCount > descMax ? "text-error" : "text-base-content/60"
                }`}
              >
                {descCount}/{descMax}
              </span>
            </div>
            <div className="relative">
              <textarea
                name="description"
                value={v.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full rounded-xl shadow-inner leading-relaxed placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 h-36 max-h-36 overflow-y-auto resize-none"
                placeholder="Comparte tu trayectoria, enfoques y lineas de trabajo en divulgacion astronomica."
                rows={6}
                maxLength={descMax}
                minLength={descMin}
                aria-invalid={descTooShort}
                aria-describedby="desc-help"
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span
                id="desc-help"
                className={`label-text-alt text-xs ${
                  descTooShort ? "text-error" : "text-base-content/60"
                }`}
              >
                {descTooShort
                  ? `Necesitas al menos ${descMin} caracteres para publicar.`
                  : `Puedes escribir hasta ${descMax} caracteres.`}
              </span>
              <progress
                className={`progress w-40 ${progressClass}`}
                value={pct}
                max="100"
                aria-label="Progreso de caracteres"
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;
