import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Clock, Ticket, ArrowLeft, UserRound } from "lucide-react";
import { DateTime } from "luxon";
import ProfileSummaryCard from "../Profile/components/ProfileSummaryCard.jsx";
import { useEvents } from "../../context/events/eventsContext.js";
import { getUserBySlug } from "../../api/auth.js";

const TZ = "America/Santiago";
const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

const statusBadge = (status) => {
  if (status === "published") return { className: "badge badge-success", label: "Publicado" };
  if (status === "cancelled") return { className: "badge badge-error gap-2", label: "Cancelado" };
  return { className: "badge badge-ghost", label: "Borrador" };
};

const formatRange = (startISO, endISO) => {
  const s = DateTime.fromISO(startISO, { zone: TZ });
  const e = DateTime.fromISO(endISO, { zone: TZ });

  if (!s.isValid) return "";

  if (e.isValid && s.hasSame(e, "day")) {
    return `${s.toFormat("dd LLL yyyy, HH:mm")} a ${e.toFormat("HH:mm")} (${s.offsetNameShort})`;
  }

  if (e.isValid) {
    return `${s.toFormat("dd LLL yyyy, HH:mm")} a ${e.toFormat("dd LLL yyyy, HH:mm")} (${s.offsetNameShort})`;
  }

  return s.toFormat("dd LLL yyyy, HH:mm");
};

const toKey = (value) => String(value || "").trim().toLowerCase();

export default function OrganizerEvents() {
  const { slug } = useParams();
  const { Event = [], getAllEvents } = useEvents();

  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsFetched, setEventsFetched] = useState(false);

  const hasEventsLoaded = Array.isArray(Event) && Event.length > 0;

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      if (!slug) {
        setProfileError("No se proporciono un perfil valido.");
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        const res = await getUserBySlug(slug);
        const data = res?.data ?? null;
        if (!active) return;
        if (data) {
          setProfile(data);
          setProfileError("");
        } else {
          setProfile(null);
          setProfileError("No encontramos este perfil.");
        }
      } catch (error) {
        if (!active) return;
        console.error("OrganizerEvents profile error:", error);
        setProfile(null);
        setProfileError("No encontramos este perfil.");
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    if (eventsFetched || hasEventsLoaded) return;

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        await getAllEvents();
      } catch (error) {
        if (active) {
          console.error("OrganizerEvents events error:", error);
        }
      } finally {
        if (active) {
          setLoadingEvents(false);
          setEventsFetched(true);
        }
      }
    };

    fetchEvents();
    return () => {
      active = false;
    };
  }, [eventsFetched, getAllEvents, hasEventsLoaded]);

  const organizerEvents = useMemo(() => {
    const list = Array.isArray(Event) ? Event : [];
    if (!slug) return [];

    const targetSlug = slug.toLowerCase();
    const targetId = profile?._id ? String(profile._id) : null;
    const profileName = profile?.username ? toKey(profile.username) : null;
    const profileEmail = profile?.email ? toKey(profile.email) : null;

    return list
      .filter((ev) => {
        const owner = ev?.createdBy;
        const ownerSlug =
          owner && typeof owner === "object" ? toKey(owner.slug) : null;
        const ownerId =
          owner && typeof owner === "object"
            ? String(owner._id || "")
            : typeof owner === "string"
            ? owner
            : null;

        if (ownerSlug && ownerSlug === targetSlug) return true;
        if (targetId && ownerId && ownerId === targetId) return true;

        if (!profileName && !profileEmail) return false;
        const organizerName = toKey(ev?.organizer);
        return (
          (profileName && organizerName === profileName) ||
          (profileEmail && organizerName === profileEmail)
        );
      })
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
  }, [Event, profile, slug]);

  const loading = loadingProfile || loadingEvents;
  const hasProfile = !!profile && !profileError;

  return (
    <section className="min-h-screen bg-base-200 py-10 lg:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 mt-15">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/eventos" className="btn btn-ghost btn-sm gap-2">
              <ArrowLeft className="size-4" />
              Volver a eventos
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Eventos del perfil
            </h1>
          </div>
          {hasProfile && (
            <div className="text-sm text-base-content/70">
              <UserRound className="inline size-4 mr-2 opacity-70" />
              {profile.username}
            </div>
          )}
        </header>

        {loading ? (
          <div className="grid gap-6">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="skeleton h-48 w-full rounded-xl" />
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-4 w-1/3 mt-2" />
              <div className="skeleton h-32 w-full mt-4" />
            </div>
          </div>
        ) : profileError ? (
          <div className="alert alert-warning">
            <span>{profileError}</span>
            <Link to="/comunidad/red_divulgadores" className="link link-primary font-semibold">
              Explorar perfiles publicados
            </Link>
          </div>
        ) : (
          <>
            {hasProfile && (
              <ProfileSummaryCard user={profile} isPublished />
            )}

            <section className="rounded-2xl border border-base-300 bg-base-100 p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  Eventos publicados
                </h2>
                <span className="badge badge-outline">
                  {organizerEvents.length} evento{organizerEvents.length === 1 ? "" : "s"}
                </span>
              </div>

              {organizerEvents.length === 0 ? (
                <p className="text-sm text-base-content/70">
                  Divulgador sin eventos todavia.
                </p>
              ) : (
                <ul className="grid gap-4">
                  {organizerEvents.map((ev) => {
                    const badge = statusBadge(ev.status);
                    return (
                      <li
                        key={ev._id || ev.id}
                        className="rounded-xl border border-base-300 bg-base-100/90 p-5 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold leading-tight">
                                {ev.title || "Evento sin titulo"}
                              </h3>
                              {ev.description && (
                                <p className="mt-1 text-sm text-base-content/70 line-clamp-3">
                                  {ev.description}
                                </p>
                              )}
                            </div>
                            <span className={badge.className}>{badge.label}</span>
                          </div>

                          <div className="grid gap-2 text-sm text-base-content/80">
                            <div className="flex items-start gap-2">
                              <CalendarDays className="size-4 mt-0.5 opacity-70" />
                              <span>
                                {formatRange(ev.startDateTime, ev.endDateTime)}
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <MapPin className="size-4 mt-0.5 opacity-70" />
                              <span>
                                {ev.isOnline ? "Online" : ev.location || "Ubicacion por confirmar"}
                              </span>
                            </div>

                            {ev.price !== undefined && ev.price !== null && (
                              <div className="flex items-start gap-2">
                                <Ticket className="size-4 mt-0.5 opacity-70" />
                                <span>
                                  {Number(ev.price) > 0 ? CLP.format(ev.price) : "Gratuito"}
                                </span>
                              </div>
                            )}

                            {Array.isArray(ev.tags) && ev.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {ev.tags.map((tag) => (
                                  <span key={tag} className="badge badge-ghost badge-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Link to="/eventos" className="btn btn-sm btn-ghost gap-2">
                              <Clock className="size-4" />
                              Ver en calendario
                            </Link>
                            {ev.url && (
                              <a
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-secondary gap-2"
                                title={ev.url}
                              >
                                Mas informacion
                              </a>
                            )}
                            {ev.isOnline && ev.urlOnline && (
                              <a
                                href={ev.urlOnline}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary gap-2"
                                title={ev.urlOnline}
                              >
                                Entrar al evento
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
}
