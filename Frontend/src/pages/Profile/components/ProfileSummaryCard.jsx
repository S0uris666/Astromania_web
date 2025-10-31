import { ExternalLink, MapPin, Copy, CheckCircle2 } from "lucide-react";
import {
  normalizeText,
  parseSpecializations,
  buildProfileLinks,
  getPrimaryImageUrl,
  getInitials,
} from "../profileUtils.js";

export const ProfileSummaryCard = ({ user, isPublished, className = "" }) => {
  if (!user) return null;

  const displayName = normalizeText(user.username) || "Tu nombre";
  const profession = normalizeText(user.profesion) || "Profesión o rol";
  const city = normalizeText(user.city);
  const email = normalizeText(user.email);

  const descriptionText =
    normalizeText(user.description) ||
    "Completa tu biografía para que la comunidad conozca tu trabajo.";
  const summary = descriptionText.length > 320 ? `${descriptionText.slice(0, 317)}…` : descriptionText;

  const specializationList = parseSpecializations(user.especializacion);
  const profileLinks = buildProfileLinks(user.links);
  const imageUrl = getPrimaryImageUrl(user.images);

  const copyToClipboard = async (text) => {
    try {
      if (!text) return false;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  return (
    <section
      className={`rounded-2xl border border-base-200/70 bg-base-100 shadow-sm overflow-hidden ${className}`}
      aria-label={`Perfil de ${displayName}`}
    >
      {/* Siempre horizontal */}
      <div className="flex">
        {/* Media izquierda: ancho fijo y proporción estable */}
        <div className="shrink-0 w-[16rem] xl:w-[18rem] bg-base-200/40">
          <div className="h-full p-6 flex items-center justify-center">
            <div className="w-full max-w-[14rem]">
              <div className="relative aspect-square rounded-2xl ring-1 ring-base-300 bg-base-100 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Imagen de ${displayName}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-base-300/60 text-base-content/70">
                    <span className="text-2xl font-semibold">{getInitials(displayName) || "?"}</span>
                  </div>
                )}
              </div>

              {isPublished && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-base-content/60 w-full justify-center">
                  <CheckCircle2 className="size-3.5" />
                  Perfil activo en Comunidad Astromanía
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Separador vertical sutil */}
        <div className="w-px bg-base-200" aria-hidden />

        {/* Contenido derecho */}
        <div className="flex-1 p-6 sm:p-8">
          {/* Cabecera: título y meta alineados a la izquierda, en una sola columna */}
          <header className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-balance">
              {displayName}
            </h2>
            <p className="text-sm text-base-content/70 flex items-center gap-2 flex-wrap">
              <span className="truncate">{profession}</span>
              {city && (
                <>
                  <span aria-hidden className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 opacity-70" />
                    <span className="truncate">{city}</span>
                  </span>
                </>
              )}
            </p>
          </header>

          {/* Especializaciones: fila con wrap simétrico */}
          {specializationList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {specializationList.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center rounded-full border border-base-300 px-3 py-1.5 text-xs text-base-content/80 hover:border-primary/50 transition"
                  title={item}
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Email: bloque fino con acción a la derecha */}
          {email && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-base-200 bg-base-100 px-3 py-2">
              <span className="text-sm">
                <span className="font-semibold">Correo:</span>{" "}
                <a
                  href={`mailto:${email}`}
                  className="link link-hover link-secondary break-all"
                  title={`Enviar correo a ${email}`}
                >
                  {email}
                </a>
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-xs tooltip"
                data-tip="Copiar correo"
                onClick={async (e) => {
                  const el = e.currentTarget;
                  const ok = await copyToClipboard(email);
                  el.dataset.tip = ok ? "¡Copiado!" : "No se pudo copiar";
                  setTimeout(() => (el.dataset.tip = "Copiar correo"), 1200);
                }}
                aria-label="Copiar correo"
                title="Copiar correo"
              >
                <Copy className="size-4" />
              </button>
            </div>
          )}

          {/* Resumen: ancho legible, sin ocupar todo el contenedor */}
          {summary && (
            <p className="mt-4 text-sm leading-relaxed text-base-content/80 text-pretty max-w-2xl">
              {summary}
            </p>
          )}

          {/* Links: fila horizontal responsive con pill minimalista */}
          {profileLinks.length > 0 && (
            <nav className="mt-5 flex flex-wrap gap-2" aria-label="Enlaces de perfil">
              {profileLinks.map((link, i) => (
                <a
                  key={`${link.url}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-base-300 px-3 py-1.5 text-sm text-base-content/80 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                  title={link.label || link.url}
                  aria-label={`Abrir ${link.label || link.url} en nueva pestaña`}
                >
                  <ExternalLink className="size-4 opacity-80" />
                  <span className="max-w-[22ch] truncate">{link.label || link.url}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileSummaryCard;

