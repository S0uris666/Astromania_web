import { useEffect, useMemo, useState } from "react";
import { Sparkles, Search, X, Filter, Tag, Users } from "lucide-react";
import ProfileSummaryCard from "./components/ProfileSummaryCard.jsx";
import { getPublishedUsers } from "../../api/auth.js";
import { normalizeText, parseSpecializations } from "./profileUtils.js";


const Pill = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border border-base-300 px-2.5 py-1 text-xs ${className}`}>
    {children}
  </span>
);

const FilterChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn btn-xs sm:btn-sm rounded-full border transition ${
      active ? "btn-primary text-primary-content" : "btn-ghost border-base-300"
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

/* Skeleton para carga */
const CardSkeleton = () => (
  <div className="rounded-2xl border border-base-300/60 bg-base-100 p-4 lg:p-0 lg:flex overflow-hidden">
    <div className="shrink-0 w-[16rem] xl:w-[18rem] bg-base-200/40">
      <div className="p-6">
        <div className="skeleton h-56 w-full rounded-2xl" />
        <div className="mt-4 flex justify-center">
          <div className="skeleton h-4 w-40 rounded-full" />
        </div>
      </div>
    </div>
    <div className="w-px bg-base-200" />
    <div className="flex-1 p-6 sm:p-8 space-y-4">
      <div className="skeleton h-6 w-64" />
      <div className="skeleton h-4 w-40" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton h-16 w-full" />
    </div>
  </div>
);

/* ── Página ────────────────────────────────────────────────────────────── */
export function PublicProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState([]);

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
        setError("No pudimos cargar la red de divulgadores, intenta más tarde.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfiles();
    return () => { isMounted = false; };
  }, []);

  const specializationOptions = useMemo(() => {
    const collection = new Set();
    profiles.forEach((p) => parseSpecializations(p?.especializacion).forEach((i) => collection.add(i)));
    return Array.from(collection).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return profiles.filter((p) => {
      const tokens = [p?.username, p?.profesion, p?.city, p?.country, p?.description];
      const matchesSearch = !needle || tokens.some((t) => normalizeText(t).toLowerCase().includes(needle));
      if (!matchesSearch) return false;
      if (!activeTags.length) return true;
      const normalized = parseSpecializations(p?.especializacion).map((i) => i.toLowerCase());
      return activeTags.every((tag) => normalized.includes(tag.toLowerCase()));
    });
  }, [profiles, searchTerm, activeTags]);

  const toggleTag = (tag) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag]));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTags([]);
  };

  const totalPublished = profiles.length;
  const totalVisible = filteredProfiles.length;

  return (
    <section className="relative min-h-screen bg-base-200">
      {/* Fondo sutil: radial + líneas suaves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300/40 to-base-200" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-35" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8 py-14">
        {/* Header minimalista */}
        <header className="rounded-2xl border border-base-300/60 bg-base-100 shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-base-content/70">
              <Sparkles className="size-3.5 opacity-80" />
              Comunidad Astromanía
            </span>
            <div className="mt-4 space-y-3">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Red de divulgadores</h1>
              <p className="max-w-2xl text-sm sm:text-base text-base-content/70">
                Descubre a quienes ya comparten su pasión por la astronomía. Explora perfiles,
                encuentra aliados y conecta con divulgadores listos para colaborar.
              </p>
            </div>
          </div>
        </header>

        {/* Barra de búsqueda y filtros (sticky) */}
        <div className="sticky top-3 z-10">
          <div className="rounded-2xl border border-base-300/70 bg-base-100/90 backdrop-blur px-4 py-4 sm:px-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Buscador */}
              <div className="relative w-full md:max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="search"
                  placeholder="Busca por nombre, especialidad o ciudad…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10"
                  aria-label="Buscar perfiles"
                />
              </div>

              {/* Resumen y acciones */}
              <div className="flex flex-wrap items-center gap-3">
                {activeTags.length > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-sm btn-ghost gap-2 border border-base-300"
                  >
                    <X className="size-4" />
                    Limpiar filtros
                  </button>
                )}
                {!loading && (
                  <Pill className="gap-2">
                    <Users className="size-3.5 opacity-70" />
                    <span className="text-xs">
                      {totalVisible} de {totalPublished} visibles
                    </span>
                  </Pill>
                )}
              </div>
            </div>

            {/* Chips activos */}
            {activeTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <ActiveTag key={tag} label={tag} onRemove={() => toggleTag(tag)} />
                ))}
              </div>
            )}

            {/* Chips de filtros (scroll-x en mobile) */}
            {!!specializationOptions.length && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {specializationOptions.map((tag) => (
                  <FilterChip
                    key={tag}
                    label={tag}
                    active={activeTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estados */}
        {loading && (
          <div className="grid grid-cols-1 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error justify-center">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && totalPublished === 0 && (
          <div className="alert alert-info justify-center">
            <span>
              Aún no hay perfiles publicados. Vuelve pronto para conocer a nuestra comunidad de divulgadores.
            </span>
          </div>
        )}

        {!loading && !error && totalPublished > 0 && totalVisible === 0 && (
          <div className="alert alert-warning justify-center">
            <span>
              No encontramos resultados con los filtros aplicados. Ajusta tu búsqueda para ver otros perfiles.
            </span>
          </div>
        )}

        {/* Grid de perfiles (listado limpio y consistente) */}
        {!loading && !error && totalVisible > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredProfiles.map((profile, index) => {
              const key = profile?._id || profile?.slug || profile?.email || index;
              return (
                <ProfileSummaryCard
                  key={key}
                  user={profile}
                  isPublished
                  className="bg-base-100"
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default PublicProfiles;

