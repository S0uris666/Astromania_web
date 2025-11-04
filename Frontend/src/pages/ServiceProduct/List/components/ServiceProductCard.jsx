import { Link } from "react-router-dom";
import {
  TYPE_LABEL,
  formatPrice,
  getCoverData,
  buildServiceInfo,
} from "../serviceProductList.helpers";

/**
 * @param {{
 *  item: Record<string, any>;
 *  onAddToCart: (item: Record<string, any>) => void;
 * }} props
 */
export const ServiceProductCard = ({ item, onAddToCart }) => {
  const type = String(item.type || "").toLowerCase();
  const href = `/servicios-productos/${item.slug || item._id || item.id}`;

  const { src, alt } = getCoverData(item);
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 4) : [];

  const isProduct = type === "product";
  const isService = type === "service";
  const isActivity = type === "activity";

  const priceLabel =
    (isProduct || isService) && typeof item.price !== "undefined"
      ? formatPrice(item.price)
      : null;

  const stockLabel =
    isProduct && typeof item.stock === "number"
      ? item.stock > 0
        ? `Stock: ${item.stock}`
        : "Sin stock"
      : null;

  const serviceInfo = isService ? buildServiceInfo(item) : [];
  const activityLocation =
    isActivity && item.location ? `Ubicacion: ${item.location}` : null;

  const badgeBase =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide";

  return (
    <article className="overflow-hidden rounded-3xl border border-base-300/60 bg-base-100/95 shadow-sm transition duration-300 hover:shadow-xl">
      <figure className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative flex aspect-[4/3] items-center justify-center bg-base-300/40">
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" loading="lazy" />
        </div>
      </figure>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <span className={`${badgeBase} border border-primary/40 bg-primary/10 text-primary`}>
            {TYPE_LABEL[type] || type}
          </span>
          {stockLabel ? (
            <span
              className={`${badgeBase} ${
                stockLabel.includes("Sin")
                  ? "border border-error/40 bg-error/10 text-error"
                  : "border border-success/40 bg-success/10 text-success"
              }`}
            >
              {stockLabel}
            </span>
          ) : null}
          {isService && priceLabel ? (
            <span className={`${badgeBase} border border-secondary/40 bg-secondary/10 text-secondary`}>
              {priceLabel}
            </span>
          ) : null}
          {isActivity && activityLocation ? (
            <span className={`${badgeBase} border border-accent/40 bg-accent/10 text-accent`}>
              {activityLocation}
            </span>
          ) : null}
        </div>

        <h2 className="line-clamp-2 text-lg font-semibold leading-tight text-base-content">
          {item.title}
        </h2>

        {item.shortDescription ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-base-content/70">
            {item.shortDescription}
          </p>
        ) : null}

        {isProduct && (
          <div className="flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <span>{formatPrice(item.price)}</span>
            {item.delivery ? <span className="text-primary/70">{item.delivery}</span> : null}
          </div>
        )}

        {isService && serviceInfo.length ? (
          <ul className="space-y-1 rounded-2xl bg-base-200/60 px-4 py-3 text-xs text-base-content/70">
            {serviceInfo.map((info) => (
              <li key={info}>{info}</li>
            ))}
          </ul>
        ) : null}

        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="badge badge-outline badge-sm border-secondary/40 text-secondary">
                #{tag}
              </span>
            ))}
            {Array.isArray(item.tags) && item.tags.length > tags.length ? (
              <span className="badge badge-outline badge-sm border-secondary/40 text-secondary">
                +{item.tags.length - tags.length}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link to={href} state={{ serviceProduct: item }} className="btn btn-secondary btn-sm gap-2">
            Ver detalles
          </Link>
          {isProduct && item.stock > 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="btn btn-sm btn-outline gap-2"
              title="Anadir al carrito"
            >
              Anadir
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
};
