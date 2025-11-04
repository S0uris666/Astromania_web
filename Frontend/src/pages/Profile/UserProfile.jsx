import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import { PaymentButton } from "../../components/Payment/PaymentButton";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(Number(value || 0));

export function UserProfile() {
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
        (total, item) =>
          total +
          Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cart]
  );

  const paymentItems = useMemo(
    () =>
      cart.map((item) => ({
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        description: item.description ?? item.title,
      })),
    [cart]
  );

  const payerInfo = useMemo(
    () => ({
      name: currentUser?.username ?? "",
      email: currentUser?.email ?? "",
      userId: currentUser?._id ?? "",
    }),
    [currentUser?._id, currentUser?.username, currentUser?.email]
  );

  const handleLogout = async () => {
    try {
      await logoutUser?.();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  };

  const handleQtyChange = (id, value) => {
    const quantity = Math.max(1, Number(value) || 1);
    setQty?.(id, quantity);
  };

  const handleRemoveItem = (id) => {
    removeFromCart?.(id);
  };

  const handleClearCart = () => {
    clearCart?.();
  };

  const handleRequireLogin = () => {
    navigate("/login?next=/perfil");
  };

  const handlePaymentSuccess = () => {
    clearCart?.();
  };

  const handlePaymentError = (error) => {
    console.error("Error en el pago:", error);
  };

  const hasCartItems = cart.length > 0;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 mt-15 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Hola, {currentUser?.username || "explorador"}
        </h1>
        <p className="text-base text-base-content/70">
          Revisa tu carrito y gestiona tus compras desde aqui.
        </p>
      </header>

      <section className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="card-title mb-0">Tu carrito</h2>
            {authState ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                Cerrar sesion
              </button>
            ) : null}
          </div>

          {!hasCartItems ? (
            <p className="opacity-70">Aun no has agregado productos.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
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
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{formatCLP(item.price)}</td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(event) =>
                              handleQtyChange(item._id, event.target.value)
                            }
                            className="input input-bordered input-xs w-20"
                          />
                        </td>
                        <td className="text-right">
                          {formatCLP(
                            Number(item.price) * Number(item.quantity)
                          )}
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => handleRemoveItem(item._id)}
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
                      <th className="text-right">{formatCLP(subtotal)}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleClearCart}
                >
                  Vaciar carrito
                </button>

                <div className="w-full sm:w-80">
                  <PaymentButton
                    items={paymentItems}
                    buttonText="Pagar con Mercado Pago"
                    className="w-full"
                    payerInfo={payerInfo}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={!paymentItems.length}
                    requireAuth
                    isAuthenticated={!!authState}
                    onRequireLogin={handleRequireLogin}
                  />
                  {!authState && (
                    <p className="text-xs opacity-70 mt-2">
                      Debes iniciar sesion para completar el pago.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserProfile;
