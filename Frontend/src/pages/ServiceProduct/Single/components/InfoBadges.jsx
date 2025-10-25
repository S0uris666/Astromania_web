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
  <div className="flex items-center gap-2 flex-wrap text-sm">
    <span className="badge badge-secondary/90">{typeLabel}</span>

    {isProduct && (
      <span className={`badge badge-sm ${hasStock ? "badge-success/90" : "badge-error/90"}`}>
        {hasStock ? `Stock: ${stock}` : "Sin stock"}
      </span>
    )}

    {isService && durationMinutes ? (
      <span className="badge badge-ghost badge-sm">Duracion: {durationMinutes} min</span>
    ) : null}

    {isService && capacity ? (
      <span className="badge badge-ghost badge-sm">Capacidad: {capacity} personas</span>
    ) : null}

    {isActivity && location ? (
      <span className="badge badge-ghost badge-sm">{location}</span>
    ) : null}

    {isActive === false && <span className="badge badge-outline">No disponible</span>}
  </div>
);

