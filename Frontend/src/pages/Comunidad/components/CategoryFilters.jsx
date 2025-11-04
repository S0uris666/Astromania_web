export function CategoryFilters({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const selected = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`btn btn-sm sm:btn-md ${
              selected
                ? "btn-primary text-base-100"
                : "btn-outline border-base-content/20 text-base-content/70 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilters;
