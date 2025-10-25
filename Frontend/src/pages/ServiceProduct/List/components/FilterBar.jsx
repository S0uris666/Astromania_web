import PropTypes from "prop-types";

export const FilterBar = ({ filters, active, onChange }) => {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`btn btn-sm ${
            active === option.value ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

