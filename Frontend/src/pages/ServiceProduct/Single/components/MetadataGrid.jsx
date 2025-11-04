/**
 * @param {{
 *  category?: string;
 *  delivery?: string;
 *  locations?: string[];
 *  isProduct: boolean;
 *  isService: boolean;
 *  className?: string;
 * }} props
 */
export const MetadataGrid = ({
  category,
  delivery,
  locations = [],
  isProduct,
  isService,
  className = "",
}) => {
  if (!category && !delivery && !(isService && locations.length)) return null;

  return (
    <section
      className={`grid gap-3 rounded-3xl border border-base-300/60 bg-base-100/95 p-5 text-sm text-base-content/80 shadow-sm sm:grid-cols-2 ${className}`}
    >
      {category ? (
        <div className="rounded-2xl border border-base-200/60 bg-base-200/30 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-base-content/60">Categoria</p>
          <p className="mt-1 font-semibold text-base-content/80">{category}</p>
        </div>
      ) : null}
      {isProduct && delivery ? (
        <div className="rounded-2xl border border-base-200/60 bg-base-200/30 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-base-content/60">Entrega</p>
          <p className="mt-1 font-semibold text-base-content/80">{delivery}</p>
        </div>
      ) : null}
      {isService && locations.length ? (
        <div className="sm:col-span-2 rounded-2xl border border-base-200/60 bg-base-200/30 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-base-content/60">Ubicaciones</p>
          <p className="mt-1 font-semibold text-base-content/80">{locations.join(", ")}</p>
        </div>
      ) : null}
    </section>
  );
};
