import PropTypes from "prop-types";

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

InfoBadges.propTypes = {
  typeLabel: PropTypes.string.isRequired,
  isProduct: PropTypes.bool.isRequired,
  stock: PropTypes.number,
  hasStock: PropTypes.bool.isRequired,
  isService: PropTypes.bool.isRequired,
  durationMinutes: PropTypes.number,
  capacity: PropTypes.number,
  isActivity: PropTypes.bool.isRequired,
  location: PropTypes.string,
  isActive: PropTypes.bool,
};

InfoBadges.defaultProps = {
  stock: 0,
  durationMinutes: undefined,
  capacity: undefined,
  location: undefined,
  isActive: true,
};
