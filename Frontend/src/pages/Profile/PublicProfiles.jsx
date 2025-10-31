import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Search, X, Filter, Tag, Users, Grid3X3, Rows } from "lucide-react";
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

const CardSkeleton = () => (
  <div className="rounded-2xl border border-base-300/60 bg-base-100 p-4">
    <div className="skeleton h-48 w-full rounded-xl" />
    <div className="mt-4 space-y-2">
      <div className="skeleton h-6 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-16 w-full" />
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
        setError("No pudimos cargar la red de divulgadores, intenta más tarde.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfiles();
    return () => { isMounted = false; };
  }, []);

  const specializationOptions = useMemo(() => {
    const set = new Set();
    profiles.forEach((p) => parseSpecializations(p?.especializacion).forEach((i) => set.add(i)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return profiles.filter((p) => {
      const tokens = [
        p?.username,
        p?.profesion,
        p?.city,
        p?.country,
        p?.description,
        ...(parseSpecializations(p?.especializacion) || []),
      ];
      const matchesSearch = !needle || tokens.some((t) => normalizeText(t).toLowerCase().includes(needle));
      if (!matchesSearch) return false;
      if (!activeTags.length) return true;
      const normalized = parseSpecializations(p?.especializacion).map((i) => i.toLowerCase());
      return activeTags.every((tag) => normalized.includes(tag.toLowerCase()));
    });
  }, [profiles, searchTerm, activeTags]);

  useEffect(() => {
    if (!loading && statusRef.current) {
      statusRef.current.textContent = `${filteredProfiles.length} perfiles visibles`;
    }
  }, [loading, filteredProfiles.length]);

  const toggleTag = (tag) => setActiveTags((prev) => (prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag]));
  const resetFilters = () => { setSearchTerm(""); setActiveTags([]); };

  const totalPublished = profiles.length;
  const totalVisible = filteredProfiles.length;

  return (
    <section className="relative min-h-screen bg-base-200">
      {/* Fondo sutil */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300/40 to-base-200" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-35" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        {/* Header minimalista: foco en personas */}
        <header className="rounded-3xl border border-base-300/60 bg-base-100 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 lg:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-base-content/70">
              <Sparkles className="size-3.5 opacity-80" /> Comunidad Astromanía
            </span>
            <div className="mt-5 space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">Red nacional de divulgación astronómica</h1>
              <p className="max-w-2xl text-sm sm:text-base text-base-content/70">
               Descubre a quienes ya comparten su pasión por la astronomía. Explora perfiles, encuentra aliados y conecta con divulgadores listos para colaborar.
              </p>
              <Pill className="gap-2"><Users className="size-3.5 opacity-70" />{totalPublished} perfiles</Pill>
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

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="join">
                  <button onClick={() => setView("grid")} className={`btn btn-sm join-item ${view === "grid" ? "btn-active" : "btn-ghost"}`} aria-pressed={view === "grid"}> 
                    <Grid3X3 className="size-4" />
                    <span className="hidden sm:inline">Tarjetas</span>
                  </button>
                  <button onClick={() => setView("list")} className={`btn btn-sm join-item ${view === "list" ? "btn-active" : "btn-ghost"}`} aria-pressed={view === "list"}>
                    <Rows className="size-4" />
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
                {(activeTags.length > 0 || searchTerm) && (
                  <button type="button" onClick={resetFilters} className="btn btn-sm btn-ghost gap-2 border border-base-300">
                    <X className="size-4" /> Limpiar
                  </button>
                )}
                <Pill className="gap-2"><Users className="size-3.5 opacity-70" /><span className="text-xs">{totalVisible} visibles</span></Pill>
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
                  <FilterChip key={tag} label={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)} />
                ))}
              </div>
            )}

            <span ref={statusRef} className="sr-only" role="status" aria-live="polite" />
          </div>
        </div>

        {/* Estados */}
        {error ? (
          <div className="text-center p-8">
            <div className="alert alert-error">{error}</div>
          </div>
        ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {Array(8).fill(0).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
        ) : (
          <div className={`grid gap-5 sm:gap-6 ${
            view === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProfiles.map((profile, index) => {
              const baseKey = profile?._id || profile?.slug || profile?.email || `p-${index}`;
              const key = `${baseKey}-${view}`;
              return (
                <div
                  key={key}
                  data-profile-key={baseKey}
                  className="rounded-2xl border border-base-300/60 bg-base-100 hover:shadow-md transition overflow-hidden"
                >
                  <ProfileSummaryCard
                    user={profile}
                    isPublished
                    className="bg-base-100"
                    orientation={view === "grid" ? "vertical" : "horizontal"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
