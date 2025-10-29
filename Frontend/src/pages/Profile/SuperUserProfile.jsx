import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import { PaymentButton } from "../../components/Payment/PaymentButton";
import { CalendarDays, ExternalLink, PencilLine, MapPin, Copy, CheckCircle2 } from "lucide-react";

const clp = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(Number(n || 0));

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseSpecializations = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return Array.from(
      new Set(value.map((item) => normalizeText(item)).filter(Boolean))
    );
  }
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parseSpecializations(parsed);
    } catch {
      return Array.from(
        new Set(
          raw
            .split(/[,;|]/g)
            .map((item) => normalizeText(item))
            .filter(Boolean)
        )
      );
    }
  }
  if (typeof value === "object") {
    return parseSpecializations(Object.values(value));
  }
  return [];
};

const getLinkLabel = (label, url) => {
  const normalizedLabel = normalizeText(label);
  if (normalizedLabel) return normalizedLabel;
  const candidate = normalizeText(url);
  if (!candidate) return "";
  const prefixed =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;
  try {
    const { hostname } = new URL(prefixed);
    return hostname.replace(/^www\./, "");
  } catch {
    return candidate;
  }
};

const buildProfileLinks = (links) =>
  (Array.isArray(links) ? links : [])
    .map((link) => {
      const url = normalizeText(link?.url);
      if (!url) return null;
      const href =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      return {
        url: href,
        label: getLinkLabel(link?.label, href),
      };
    })
    .filter(Boolean);

const getPrimaryImageUrl = (images) => {
  if (!Array.isArray(images)) return "";
  const entry = images.find((image) => normalizeText(image?.url));
  return entry?.url || "";
};

/** === Card mejorada con DaisyUI (v2) === */
const ProfileSummaryCard = ({ user, isPublished }) => {
  if (!user) return null;

  const displayName = normalizeText(user.username) || "Tu nombre";
  const profession = normalizeText(user.profesion) || "Profesión o rol";
  const city = normalizeText(user.city);
  const email = normalizeText(user.email);

  const descriptionText =
    normalizeText(user.description) ||
    "Completa tu biografía para que la comunidad conozca tu trabajo.";
  const summary =
    descriptionText.length > 320 ? `${descriptionText.slice(0, 317)}…` : descriptionText;

  const specializationList = parseSpecializations(user.especializacion);
  const profileLinks = buildProfileLinks(user.links);
  const imageUrl = getPrimaryImageUrl(user.images);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="card bg-base-100 border border-base-200 shadow-xl lg:card-side overflow-hidden transition hover:shadow-2xl">
      {/* Imagen / Placeholder */}
      <figure className="bg-gradient-to-br from-base-200 via-base-300/40 to-base-200 lg:w-72 xl:w-80 p-6 flex items-center justify-center">
{imageUrl ? (
  <div className="avatar">
    <div className="mask mask-squircle bg-base-100 border border-base-200 shadow-inner size-56 sm:size-64 lg:size-72">
      <img
        src={imageUrl}
        alt={`Imagen de ${displayName}`}
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  </div>
) : (
  <div className="avatar placeholder">
    <div className="mask mask-squircle bg-base-300/70 text-base-content/60 size-56 sm:size-64 lg:size-72 relative">
      
      <span className="absolute inset-0 grid place-items-center text-center text-[11px] leading-none uppercase tracking-wider">
        Sin imagen
      </span>
    </div>
  </div>
)}
      </figure>

      {/* Contenido */}
      <div className="card-body gap-4 lg:flex-1">
        {/* Header: nombre + meta + estado */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <h2 className="card-title text-xl sm:text-2xl leading-tight break-words">
              {displayName}
            </h2>

            <p className="text-sm text-base-content/70 flex flex-wrap items-center gap-x-2">
              <span className="truncate">{profession}</span>
              {city && (
                <>
                  <span className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 opacity-70" />
                    <span className="truncate">{city}</span>
                  </span>
                </>
              )}
            </p>
          </div>


        </div>

        {/* Chips de especialización */}
        {specializationList.length > 0 && (
          <div className="card-actions justify-start flex-wrap gap-2">
            {specializationList.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="badge badge-outline badge-lg hover:badge-primary transition"
                title={item}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Correo con copiar */}
        {email && (
          <div className="alert alert-neutral py-2 px-3 flex items-center justify-between gap-2">
            <span className="text-sm">
              <span className="font-semibold">Correo:</span>{" "}
              <a
                href={`mailto:${email}`}
                className="link link-primary break-all"
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
                const ok = await copyToClipboard(email);
                const el = e.currentTarget;
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

        {/* Descripción */}
        {summary && (
          <p className="text-sm leading-relaxed text-base-content/80">{summary}</p>
        )}

        {/* Links perfil */}
        {profileLinks.length > 0 && (
          <div className="card-actions justify-start flex-wrap gap-2 mt-1">
            {profileLinks.map((link, index) => (
              <a
                key={`${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm gap-2 transition hover:btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                title={link.label || link.url}
                aria-label={`Abrir ${link.label || link.url} en una nueva pestaña`}
              >
                <ExternalLink className="size-4" />
                <span className="max-w-[18ch] truncate">
                  {link.label || link.url}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Sello opcional cuando está publicado */}
        {isPublished && (
          <div className="mt-1 text-xs text-base-content/60 inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Perfil activo en Comunidad Astromanía
          </div>
        )}
      </div>
    </div>
  );
};

export function SuperUserProfile() {
  const navigate = useNavigate();
  const {
    currentUser,
    authState,
    cart = [],
    logoutUser,
    removeFromCart,
    setQty,
    clearCart,
  } = useContext(UserContext) || {};

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 0),
        0
      ),
    [cart]
  );

  const paymentItems = cart.map((it) => ({
    title: it.title,
    price: Number(it.price),
    quantity: Number(it.quantity),
    description: it.description ?? it.title,
  }));

  const payerInfo = {
    name: currentUser?.username ?? "",
    email: currentUser?.email ?? "",
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesion:", err);
    }
  };

  const profileStatus = String(currentUser?.status || "").toLowerCase();
  const isPublished = profileStatus === "published";
  const publicProfileUrl =
    isPublished && currentUser?.slug
      ? `/comunidad/divulgadores/${currentUser.slug}`
      : null;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 mt-15 space-y-6">
      <header className="card bg-base-200 shadow-md">
        <div className="card-body space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide opacity-70">
                Panel de divulgador
              </p>
              <h1 className="text-3xl font-bold leading-tight">
                Hola, {currentUser?.username}
              </h1>
              <p className="text-base text-base-content/70 mt-2">
                Administra tu presencia pública y mantén al día tu perfil de
                divulgador.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/perfil_divulgador/editar" className="btn btn-primary btn-sm gap-2">
                <PencilLine className="size-4" />
                Editar perfil
              </Link>
              {publicProfileUrl && (
                <Link
                  to={publicProfileUrl}
                  className="btn btn-ghost btn-sm gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                  Ver perfil público
                </Link>
              )}
            </div>
          </div>

          <div className="max-w-3xl">
            <ProfileSummaryCard user={currentUser} isPublished={isPublished} />
          </div>

          {!isPublished && (
            <div className="alert alert-warning">
              <span>
                Tu perfil está oculto. Activa la opción &quot;Visible para la
                comunidad&quot; en la edición para aparecer en Comunidad &gt;
                Divulgadores.
              </span>
            </div>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Eventos</h2>
              <CalendarDays className="size-5" />
            </div>
            <p className="text-sm text-base-content/70">
              Programa actividades con fecha, lugar, aforo e inscripción.
            </p>
            <div className="card-actions justify-end gap-2">
              <Link to="/admin/eventos/nuevo" className="btn btn-primary btn-sm">
                Nuevo evento
              </Link>
              <Link to="/admin/eventos/editar" className="btn btn-ghost btn-sm">
                Gestionar
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="card-body space-y-3">
            <h2 className="card-title">Cuenta</h2>
            <p className="text-sm text-base-content/70">
              Ajusta tus preferencias o cierra sesión cuando lo necesites.
            </p>
            <div className="card-actions justify-end">
              <button type="button" onClick={handleLogout} className="btn btn-error btn-sm">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Carrito de productos</h2>
                <span className="badge badge-outline">{cart.length} ítems</span>
              </div>

              {!cart.length ? (
                <p className="opacity-70">Tu carrito está vacío por ahora.</p>
              ) : (
                <>
                  <div className="overflow-x-auto mt-2">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th className="text-right">Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((it) => (
                          <tr key={it._id}>
                            <td>{it.title}</td>
                            <td>{clp(it.price)}</td>
                            <td>
                              <input
                                type="number"
                                min={1}
                                value={it.quantity}
                                onChange={(e) => setQty(it._id, e.target.value)}
                                className="input input-bordered input-xs w-20"
                              />
                            </td>
                            <td className="text-right">
                              {clp(Number(it.price) * Number(it.quantity))}
                            </td>
                            <td className="text-right">
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => removeFromCart(it._id)}
                                title="Quitar"
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={3} className="text-right">
                            Total
                          </th>
                          <th className="text-right">{clp(subtotal)}</th>
                          <th></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
                    <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                      Vaciar carrito
                    </button>
                    <div className="w-full sm:w-80">
                      <PaymentButton
                        items={paymentItems}
                        buttonText="Pagar con Mercado Pago"
                        className="w-full"
                        payerInfo={payerInfo}
                        onSuccess={clearCart}
                        onError={(err) => console.error("Error en el pago:", err)}
                        disabled={!paymentItems.length}
                        requireAuth
                        isAuthenticated={!!authState}
                        onRequireLogin={() =>
                          navigate("/login?next=/perfil_divulgador")
                        }
                      />
                      {!authState && (
                        <p className="text-xs opacity-70 mt-2">
                          Debes{" "}
                          <Link to="/login" className="link link-primary">
                            iniciar sesión
                          </Link>{" "}
                          para completar el pago.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuperUserProfile;
