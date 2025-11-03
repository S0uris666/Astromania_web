import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import { PaymentButton } from "../../components/Payment/PaymentButton";
import { CalendarDays, ExternalLink, PencilLine } from "lucide-react";
import ProfileSummaryCard from "./components/ProfileSummaryCard.jsx";

const clp = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(Number(n || 0));


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
      ? `/comunidad/red_divulgadores`
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
                <span className="badge badge-outline">{cart.length} Items</span>
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
                            iniciar sesion
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


