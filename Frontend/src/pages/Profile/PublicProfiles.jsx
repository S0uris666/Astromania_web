import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, X, Filter, Tag, Users, Grid3X3, Rows } from "lucide-react";
import ProfileSummaryCard from "./components/ProfileSummaryCard.jsx";
import { getPublishedUsers } from "../../api/auth.js";
import { normalizeText, parseSpecializations } from "./profileUtils.js";

const Pill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border border-base-200 bg-base-100/80 px-3 py-1 text-xs font-medium text-base-content/70 shadow-sm ${className}`}
  >
    {children}
  </span>
);

const FilterChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn btn-xs sm:btn-sm rounded-full transition ${
      active
        ? "btn-primary text-primary-content shadow-md shadow-primary/40"
        : "btn-outline border-base-300 text-base-content/70 hover:border-primary/40 hover:text-primary"
    }`}
    title={label}
  >
    <Filter className="size-3.5" />
    <span className="line-clamp-1">{label}</span>
  </button>
);

const ActiveTag = ({ label, onRemove }) => (
  <Pill className="gap-2 bg-primary/5 text-base-content/80">
    <Tag className="size-3.5 opacity-70" />
    <span className="max-w-[16ch] truncate">{label}</span>
    <button type="button" aria-label={`Quitar ${label}`} onClick={onRemove} className="opacity-70 hover:opacity-100">
      <X className="size-3.5" />
    </button>
  </Pill>
);

const CardSkeleton = () => (
  <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-base-300/60 bg-base-100/90 p-4">
    <div className="h-40 rounded-xl bg-base-300/70" />
    <div className="mt-4 space-y-2">
      <div className="h-5 w-2/3 rounded bg-base-300/70" />
      <div className="h-4 w-1/3 rounded bg-base-300/60" />
      <div className="h-16 rounded bg-base-300/50" />
    </div>
  </div>
);

export default function PublicProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [view, setView] = useState("grid"); // grid | list
  const statusRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await getPublishedUsers();
        const data = response?.data?.data || response?.data || response || [];
        if (!isMounted) return;
        setProfiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching published users", err);
        if (!isMounted) return;
        setError("No pudimos cargar la red de divulgadores, intenta mas tarde.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const specializationOptions = useMemo(() => {
    const set = new Set();
    profiles.forEach((profile) => {
      parseSpecializations(profile?.especializacion).forEach((item) => set.add(item));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return profiles.filter((profile) => {
      const tokens = [
        profile?.username,
        profile?.profesion,
        profile?.city,
        profile?.country,
        profile?.description,
        ...(parseSpecializations(profile?.especializacion) || []),
      ];

      const matchesSearch =
        !needle || tokens.some((token) => normalizeText(token).toLowerCase().includes(needle));

      if (!matchesSearch) return false;

      if (!activeTags.length) return true;

      const normalized = parseSpecializations(profile?.especializacion).map((item) => item.toLowerCase());
      return activeTags.every((tag) => normalized.includes(tag.toLowerCase()));
    });
  }, [profiles, searchTerm, activeTags]);

  useEffect(() => {
    if (!loading && statusRef.current) {
      statusRef.current.textContent = `${filteredProfiles.length} perfiles visibles`;
    }
  }, [loading, filteredProfiles.length]);

  const toggleTag = (tag) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTags([]);
  };

  const totalPublished = profiles.length;
  const totalVisible = filteredProfiles.length;

  return (
    <section className="relative min-h-screen bg-base-200">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300/40 to-base-200" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-35" />
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-100 shadow-xl">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(15,23,42,0.35))]" />
          <div className="absolute right-10 top-12 hidden h-32 w-32 rounded-full bg-primary/30 blur-3xl sm:block" />
          <div className="relative grid gap-10 px-6 py-10 text-white sm:px-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold tracking-[0.3em] text-white/80">
                <Sparkles className="size-3.5" /> Comunidad Astromania
              </span>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Red nacional de divulgacion astronomica
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-white/80">
                Descubre a quienes ya comparten su pasion por la astronomia. Explora perfiles, encuentra aliados y
                conecta con divulgadores listos para colaborar en actividades y proyectos educativos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Pill className="border-white/20 bg-white/10 text-white/80">
                  <Users className="size-3.5 opacity-80" />
                  {totalPublished} perfiles publicados
                </Pill>
                <Pill className="border-white/20 bg-white/10 text-white/80">
                  <Filter className="size-3.5 opacity-80" />
                  {specializationOptions.length} especialidades
                </Pill>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-sm text-white/80 backdrop-blur">
              <h2 className="text-base font-semibold text-white">Que puedes hacer aqui</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  Explora el trabajo de divulgadores profesionales, docentes, astrofotografos y artistas cientificos.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                  Filtra por especialidad para encontrar socios estrategicos para tus proyectos o talleres.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  Revisa enlaces de contacto y participa en actividades organizadas por cada perfil.
                </li>
              </ul>
              <Link
                to="/perfil_divulgador"
                className="btn btn-sm btn-secondary text-secondary-content no-underline hover:-translate-y-0.5 hover:shadow-lg"
              >
                Quieres sumarte? Completa tu perfil
              </Link>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <div className="sticky top-3 z-10">
          <div className="rounded-2xl border border-base-200 bg-base-100/95 px-4 py-4 shadow-lg backdrop-blur sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="search"
                  placeholder="Busca por nombre, especialidad o ciudad..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input input-bordered w-full rounded-full pl-10"
                  aria-label="Buscar perfiles"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="join">
                  <button
                    onClick={() => setView("grid")}
                    className={`btn btn-sm join-item ${view === "grid" ? "btn-active" : "btn-ghost"}`}
                    aria-pressed={view === "grid"}
                  >
                    <Grid3X3 className="size-4" />
                    <span className="hidden sm:inline">Tarjetas</span>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`btn btn-sm join-item ${view === "list" ? "btn-active" : "btn-ghost"}`}
                    aria-pressed={view === "list"}
                  >
                    <Rows className="size-4" />
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
                {(activeTags.length > 0 || searchTerm) && (
                  <button type="button" onClick={resetFilters} className="btn btn-sm btn-ghost gap-2 border border-base-300">
                    <X className="size-4" /> Limpiar
                  </button>
                )}
                <Pill className="gap-2">
                  <Users className="size-3.5 opacity-70" />
                  <span className="text-xs">{totalVisible} visibles</span>
                </Pill>
              </div>
            </div>

            {activeTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <ActiveTag key={tag} label={tag} onRemove={() => toggleTag(tag)} />
                ))}
              </div>
            )}

            {!!specializationOptions.length && (
              <div className="mt-4 border-t border-base-200 pt-4">
                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {specializationOptions.map((tag) => (
                    <FilterChip key={tag} label={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)} />
                  ))}
                </div>
              </div>
            )}

            <span ref={statusRef} className="sr-only" role="status" aria-live="polite" />
          </div>
        </div>

        {/* Estados */}
        {error ? (
          <div className="p-8 text-center">
            <div className="alert alert-error">{error}</div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : totalVisible === 0 ? (
          <div className="rounded-3xl border border-base-300/60 bg-base-100/90 p-12 text-center shadow-lg">
            <Sparkles className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold text-base-content">No encontramos perfiles con ese filtro</h2>
            <p className="mt-3 text-sm text-base-content/70">
              Ajusta tu busqueda o prueba quitando algunas especialidades para descubrir mas divulgadores.
            </p>
            <button type="button" onClick={resetFilters} className="btn btn-primary btn-sm mt-6">
              Ver todos los perfiles
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-5 sm:gap-6 ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProfiles.map((profile, index) => {
              const baseKey = profile?._id || profile?.slug || profile?.publicEmail || `p-${index}`;
              const key = `${baseKey}-${view}`;
              const slug = (profile?.slug || "").trim();
              const hasEventsLink = slug.length > 0;

              return (
                <div
                  key={key}
                  data-profile-key={baseKey}
                  className="flex flex-col overflow-hidden rounded-2xl border border-base-300/60 bg-base-100/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <ProfileSummaryCard
                    user={profile}
                    isPublished
                    className="flex-1 bg-base-100/95"
                    orientation={view === "grid" ? "vertical" : "horizontal"}
                  />
                  <div className="border-t border-base-200 bg-base-100 px-4 py-3 sm:px-6 sm:py-4">
                    {hasEventsLink ? (
                      <Link to={`/eventos/organizador/${slug}`} className="btn btn-primary btn-sm w-full gap-2 sm:w-auto">
                        Ver Perfil
                      </Link>
                    ) : (
                      <span className="text-xs sm:text-sm text-base-content/60">
                        Este perfil aun no tiene un enlace de eventos disponible.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
