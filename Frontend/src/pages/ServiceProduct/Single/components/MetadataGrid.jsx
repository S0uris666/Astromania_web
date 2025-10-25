/**
 * @param {{
 *  category?: string;
 *  delivery?: string;
 *  locations?: string[];
 *  isProduct: boolean;
 *  isService: boolean;
 * }} props
 */
export const MetadataGrid = ({
  category,
  delivery,
  locations = [],
  isProduct,
  isService,
}) => {
  if (!category && !delivery && !(isService && locations.length)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content/80">
      {category ? <div>Categoria: {category}</div> : null}
      {isProduct && delivery ? <div>Entrega: {delivery}</div> : null}
      {isService && locations.length ? (
        <div className="sm:col-span-2">Ubicaciones: {locations.join(", ")}</div>
      ) : null}
    </div>
  );
};

