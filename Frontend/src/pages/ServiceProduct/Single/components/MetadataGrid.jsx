import PropTypes from "prop-types";

export const MetadataGrid = ({
  category,
  delivery,
  locations,
  isProduct,
  isService,
}) => {
  if (!category && !delivery && !(isService && locations.length)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content/80">
      {category ? <div>Categoría: {category}</div> : null}
      {isProduct && delivery ? <div>Entrega: {delivery}</div> : null}
      {isService && locations.length ? (
        <div className="sm:col-span-2">Ubicaciones: {locations.join(", ")}</div>
      ) : null}
    </div>
  );
};

MetadataGrid.propTypes = {
  category: PropTypes.string,
  delivery: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.string),
  isProduct: PropTypes.bool.isRequired,
  isService: PropTypes.bool.isRequired,
};

MetadataGrid.defaultProps = {
  category: undefined,
  delivery: undefined,
  locations: [],
};

