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
    <div className="mt-15 mx-auto max-w-7xl space-y-8 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-100 shadow-xl">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.4))]" />
        <div className="absolute -right-24 bottom-0 hidden h-56 w-56 rounded-full bg-primary/30 blur-3xl sm:block" />
        <div className="relative flex flex-col gap-8 px-6 py-12 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold tracking-[0.3em] uppercase text-white/70">
              Universo Astromania
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                Servicios, productos y experiencias astronomicas
              </h1>
              <p className="text-sm sm:text-base text-white/80">
                Un catalogo seleccionado para colegios, municipios, empresas y familias que buscan vivir la astronomia de una forma cercana y memorable.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                {items.length} opciones disponibles
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                Actividades presenciales y virtuales
              </span>
            </div>
          </div>
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-sm text-white/80 backdrop-blur">
            <h2 className="text-base font-semibold text-white">Como elegir lo que buscas</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                Filtra por tipo para diferenciar productos, servicios y experiencias.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                Revisa la disponibilidad, ubicacion y formato (online/presencial).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                Explora tags y descripciones para encontrar propuestas ideales para tu publico.
              </li>
            </ul>
          </div>
        </div>
      </header>

      <FilterBar
        filters={TYPE_FILTERS}
        active={filterType}
        onChange={setFilterType}
      />

      {loading ? (
        <ServiceProductSkeleton />
      ) : !filteredItems.length ? (
        <div className="rounded-3xl border border-base-300/60 bg-base-100/90 p-12 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-base-content">No encontramos elementos para esta categoria</h2>
          <p className="mt-3 text-sm text-base-content/70">
            Ajusta tu filtro o vuelve pronto, estamos agregando nuevas experiencias regularmente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ServiceProductCard key={item._id || item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};
