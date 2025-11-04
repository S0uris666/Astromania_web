import { Link } from "react-router-dom";

/**
 * @param {{
 *   isProduct: boolean;
 *   priceLabel: string;
 *   hasStock: boolean;
 *   onAddToCart: () => void;
 *   onBack: () => void;
 *   className?: string;
 * }} props
 */
export const ActionButtons = ({
  isProduct,
  priceLabel,
  hasStock,
  onAddToCart,
  onBack,
  className = "",
}) => (
  <div
    className={`flex flex-col gap-4 rounded-3xl border border-base-300/60 bg-base-100/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
  >
    <div>
      {priceLabel ? (
        <span className={`block font-semibold tracking-tight ${isProduct ? "text-3xl" : "text-2xl"}`}>
          {priceLabel}
        </span>
      ) : (
        <span className="text-base-content/70">Solicita informacion </span>
      )}
      {isProduct && !hasStock ? (
        <p className="mt-1 text-xs text-error">Sin stock disponible por ahora.</p>
      ) : null}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      {isProduct ? (
        <>
          <button
            className="btn btn-primary gap-2"
            disabled={!hasStock}
            onClick={onAddToCart}
            title={hasStock ? "Anadir al carrito" : "Sin stock disponible"}
          >
            Anadir al carrito
          </button>
          <button className="btn btn-ghost" onClick={onBack}>
            Volver
          </button>
        </>
      ) : (
        <>
          <Link to="/contacto" className="btn btn-primary gap-2">
            Contactar
          </Link>
          <button className="btn btn-ghost" onClick={onBack}>
            Volver
          </button>
        </>
      )}
    </div>
  </div>
);
