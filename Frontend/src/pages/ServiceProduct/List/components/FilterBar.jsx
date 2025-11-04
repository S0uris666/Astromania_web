/**
 * @param {{
 *  filters: Array<{value: string, label: string}>;
 *  active: string;
 *  onChange: (value: string) => void;
 * }} props
 */
export const FilterBar = ({ filters, active, onChange }) => {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`btn btn-sm ${
            active === option.value ? "btn-secondary" : "btn-outline"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

