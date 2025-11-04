import { useContext, useEffect, useMemo, useState } from "react";
import ServiceProductContext from "../../../context/serviceProducts/ServiceProductContext";
import { UserContext } from "../../../context/user/UserContext";
import {
  TYPE_FILTERS,
  filterItemsByType,
} from "./serviceProductList.helpers";
import { FilterBar } from "./components/FilterBar";
import { ServiceProductCard } from "./components/ServiceProductCard";
import { ServiceProductSkeleton } from "./components/ServiceProductSkeleton";

export const ServiceProductList = () => {
  const { addToCart } = useContext(UserContext);
  const { serviceProduct = [], getSP } = useContext(ServiceProductContext);

  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSP()
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [getSP]);

  const items = useMemo(
    () => (Array.isArray(serviceProduct) ? serviceProduct : []),
    [serviceProduct]
  );

  const filteredItems = useMemo(
    () => filterItemsByType(items, filterType),
    [items, filterType]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 ">
      <header className="mt-15 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Servicios y Productos
        </h1>
        <p className="text-base text-base-content/70 max-w-3xl">
          Explora nuestro catalogo de productos, servicios y actividades
          pensados para acercar la astronomia a todas las edades.
        </p>
      </header>

      <FilterBar
        filters={TYPE_FILTERS}
        active={filterType}
        onChange={setFilterType}
      />

      {loading ? (
        <ServiceProductSkeleton />
      ) : !filteredItems.length ? (
        <div className="rounded-xl border border-base-300 p-8 text-base-content/70 text-center">
          No encontramos elementos para esta categoria por ahora.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <ServiceProductCard
              key={item._id || item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
