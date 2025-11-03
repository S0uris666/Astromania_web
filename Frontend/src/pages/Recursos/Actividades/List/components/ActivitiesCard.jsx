import { Link } from "react-router-dom";
import {
  TYPE_LABEL,
  formatPrice,
  getCoverData,
  buildServiceInfo,
} from "../ActivitiesHelpers";

/**
 * @param {{
 *  item: Record<string, any>;
 *  onAddToCart: (item: Record<string, any>) => void;
 * }} props
 */
export const ActivitiesCard = ({ item, onAddToCart }) => {
  const type = String(item.type || "").toLowerCase();
  const isProduct = type === "product";
  const isService = type === "service";
  const isActivity = type === "activity";
  const slug = item.slug || item._id || item.id;
  const href = isActivity
    ? `/recursos/actividades/${slug}`
    : `/servicios-productos/${slug}`;

  const { src, alt } = getCoverData(item);
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 4) : [];

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

  return (
    <article className="group rounded-2xl border border-base-300/60 bg-neutral shadow-sm hover:shadow-xl hover:border-base-300 transition-all overflow-hidden">
      <figure className="relative aspect-[4/3] bg-base-300/60">
        <div className="absolute inset-0 grid place-items-center">
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      </figure>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge badge-secondary/90 font-medium">
            {TYPE_LABEL[type] || type}
          </span>

          {stockLabel ? (
            <span
              className={`badge badge-sm ${
                stockLabel.includes("Sin") ? "badge-error/90" : "badge-success/90"
              }`}
            >
              {stockLabel}
            </span>
          ) : null}

          {isService && priceLabel ? (
            <span className="badge badge-ghost badge-sm">{priceLabel}</span>
          ) : null}

          {isActivity && activityLocation ? (
            <span className="badge badge-ghost badge-sm">{activityLocation}</span>
          ) : null}
        </div>

        <h2 className="text-lg font-semibold leading-tight group-hover:opacity-90">
          {item.title}
        </h2>

        {item.shortDescription ? (
          <p className="text-sm text-base-content/80 leading-relaxed line-clamp-4">
            {item.shortDescription}
          </p>
        ) : null}

        {isProduct && (
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{formatPrice(item.price)}</span>
            {item.delivery ? <span className="opacity-70">{item.delivery}</span> : null}
          </div>
        )}

        {isService && serviceInfo.length ? (
          <ul className="text-xs text-base-content/70 space-y-1">
            {serviceInfo.map((info) => (
              <li key={info}>{info}</li>
            ))}
          </ul>
        ) : null}

        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="badge badge-ghost badge-sm">
                #{tag}
              </span>
            ))}
            {Array.isArray(item.tags) && item.tags.length > tags.length ? (
              <span className="badge badge-ghost badge-sm">
                +{item.tags.length - tags.length}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 pt-2">
          <Link
            to={href}
            state={{ serviceProduct: item }}
            className="btn btn-primary btn-sm"
          >
            Ver detalles
          </Link>

          {isProduct && item.stock > 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="btn btn-sm btn-outline"
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

