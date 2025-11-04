/**
 * @param {{
 *   typeLabel: string;
 *   isProduct: boolean;
 *   stock?: number;
 *   hasStock: boolean;
 *   isService: boolean;
 *   durationMinutes?: number;
 *   capacity?: number;
 *   isActivity: boolean;
 *   location?: string;
 *   isActive?: boolean;
 * }} props
 */
export const InfoBadges = ({
  typeLabel,
  isProduct,
  stock,
  hasStock,
  isService,
  durationMinutes,
  capacity,
  isActivity,
  location,
  isActive,
}) => (
  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
    <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
      {typeLabel}
    </span>

    {isProduct && (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
          hasStock
            ? "border border-success/40 bg-success/10 text-success"
            : "border border-error/40 bg-error/10 text-error"
        }`}
      >
        {hasStock ? `Stock: ${stock}` : "Sin stock"}
      </span>
    )}

    {isService && durationMinutes ? (
      <span className="inline-flex items-center rounded-full border border-base-300/70 bg-base-200/60 px-3 py-1 text-base-content/70">
        Duracion: {durationMinutes} min
      </span>
    ) : null}

    {isService && capacity ? (
      <span className="inline-flex items-center rounded-full border border-base-300/70 bg-base-200/60 px-3 py-1 text-base-content/70">
        Capacidad: {capacity} personas
      </span>
    ) : null}

    {isActivity && location ? (
      <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
        {location}
      </span>
    ) : null}

    {isActive === false && (
      <span className="inline-flex items-center rounded-full border border-base-300/70 bg-base-200/80 px-3 py-1 text-base-content/70">
        No disponible
      </span>
    )}
  </div>
);
