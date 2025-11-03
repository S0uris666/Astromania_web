import { useMemo } from "react";
import { Mail, User, MapPin, Briefcase, Stars, Info } from "lucide-react";

const ProfileForm = ({ values = {}, onFieldChange, errors = {} }) => {
  const v = useMemo(() => ({
    username: values.username || "",
    email: values.email || "",
    publicEmail: values.publicEmail || "",
    status: values.status || "published",
    profesion: values.profesion || "",
    especializacion: values.especializacion || "",
    city: values.city || "",
    description: values.description || "",
  }), [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFieldChange?.(name, value);
  };

  const descCount = v.description.length;
  const descMax = 500;

  return (
    <section className="card bg-base-100 border border-base-300/60 shadow-sm">
      <div className="card-body p-5 sm:p-6 lg:p-8">
        <header className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary"><Info className="size-5" /></div>
          <div>
            <h2 className="card-title text-lg sm:text-xl">Información profesional</h2>
            <p className="text-sm text-base-content/70">Completa tu perfil para que la comunidad pueda encontrarte y contactarte.</p>
          </div>
        </header>

        {/* Grid responsive: 1 / 2 columnas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Nombre */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Nombre</span></div>
            <div className="relative">
              <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
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
            {errors.username && <span id="err-username" className="label-text-alt text-error">{errors.username}</span>}
          </label>

          {/* Correo registrado (solo lectura) */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Correo registrado</span></div>
            <div className="relative">
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="email"
                value={v.email}
                readOnly
                disabled
                className="input input-bordered w-full pl-9 bg-base-300/30 cursor-not-allowed text-base-content/70"
                placeholder="Correo con el que te registraste"
                aria-readonly
              />
            </div>
            <span className="label-text-alt text-xs text-base-content/60">Este correo es parte de tu cuenta y no se puede editar.</span>
          </label>

          {/* Correo público */}
          <label className="form-control w-full md:col-span-2">
            <div className="label"><span className="label-text">Correo público</span></div>
            <div className="relative">
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="email"
                name="publicEmail"
                value={v.publicEmail}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Tu email de contacto público"
                autoComplete="email"
                inputMode="email"
                aria-invalid={!!errors.publicEmail}
                aria-describedby={errors.publicEmail ? "err-publicEmail" : undefined}
              />
            </div>
            <div className="label">
              <span className="label-text-alt text-xs text-base-content/60">Se mostrará en tu tarjeta. Si lo dejas vacío, se usará tu correo de cuenta.</span>
              {errors.publicEmail && <span id="err-publicEmail" className="label-text-alt text-error">{errors.publicEmail}</span>}
            </div>
          </label>

          {/* Visibilidad */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Visibilidad del perfil</span></div>
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

          {/* Profesión */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Profesión</span></div>
            <div className="relative">
              <Briefcase className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="text"
                name="profesion"
                value={v.profesion}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Astrofísico/a, divulgador/a, educador/a..."
                maxLength={80}
              />
            </div>
          </label>

          {/* Especialización */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Especialización</span></div>
            <div className="relative">
              <Stars className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="text"
                name="especializacion"
                value={v.especializacion}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Cosmología, Observación, Educación..."
                maxLength={120}
              />
            </div>
            <span className="label-text-alt text-xs text-base-content/60">Puedes separar varias con comas.</span>
          </label>

          {/* Ciudad */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Ciudad</span></div>
            <div className="relative">
              <MapPin className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="text"
                name="city"
                value={v.city}
                onChange={handleChange}
                className="input input-bordered w-full pl-9"
                placeholder="Valparaíso, Santiago, Concepción..."
                maxLength={80}
              />
            </div>
          </label>

          {/* Descripción (ocupa dos columnas en md+) */}
          <label className="form-control w-full md:col-span-2">
            <div className="label"><span className="label-text">Descripción</span></div>
            <textarea
              name="description"
              value={v.description}
              onChange={handleChange}
              className="textarea textarea-bordered min-h-[140px]"
              placeholder="Comparte tu trayectoria y enfoque como divulgador/a."
              maxLength={descMax}
              aria-describedby="desc-help"
            />
            <div className="label">
              <span id="desc-help" className="label-text-alt text-xs text-base-content/60">Entre 10 y {descMax} caracteres es una extensión cómoda para lectura rápida.</span>
              <span className={`label-text-alt ${descCount > descMax ? "text-error" : "text-base-content/60"}`}>
                {descCount}/{descMax}
              </span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;