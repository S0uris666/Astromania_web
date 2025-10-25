import { Link } from "react-router-dom";

/**
 * @param {{
 *   isProduct: boolean;
 *   priceLabel: string;
 *   hasStock: boolean;
 *   onAddToCart: () => void;
 *   onBack: () => void;
 * }} props
 */
export const ActionButtons = ({
  isProduct,
  priceLabel,
  hasStock,
  onAddToCart,
  onBack,
}) => (
  <div className="flex flex-wrap gap-3 pt-2">
    <span className={`font-semibold tracking-tight ${isProduct ? "text-3xl" : "text-2xl"}`}>
      {priceLabel}
    </span>

    <div className="flex gap-2">
      {isProduct ? (
        <>
          <button
            className="btn btn-primary"
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
          <Link to="/contacto" className="btn btn-primary">
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

