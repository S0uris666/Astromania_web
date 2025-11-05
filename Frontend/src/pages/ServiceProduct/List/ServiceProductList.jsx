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
<header className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-md">
  {/* Fondo sobrio con degradé sutil */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300/30 to-base-200" />
    <div className="absolute -right-20 bottom-0 hidden h-44 w-44 rounded-full bg-primary/15 blur-3xl md:block" />
  </div>

  <div className="relative flex flex-col gap-6 px-4 py-8 text-base-content sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-10">
    {/* Columna izquierda: texto y stats */}
    <div className="max-w-2xl space-y-4">
      <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-base-content/70">
        Universo Astromanía
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
          Servicios, productos y experiencias astronómicas
        </h1>
        <p className="text-sm text-base-content/70 sm:text-[15px]">
          Un catálogo para colegios, municipios, empresas y familias que buscan vivir la astronomía de forma cercana y memorable.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-2.5 py-0.5 text-[11px] text-base-content/70">
          {(items?.length ?? 0)} opciones disponibles
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-2.5 py-0.5 text-[11px] text-base-content/70">
          Presenciales y virtuales
        </span>
      </div>
    </div>

    {/* Columna derecha: pasos (tarjeta compacta) */}
    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-5 text-sm text-base-content shadow-sm">
      <h2 className="text-[15px] font-semibold">Cómo comprar</h2>

      {/* En 2 columnas desde sm para ahorrar alto */}
      <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <li className="flex gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-content">1</span>
          <div>
            <p className="font-medium leading-tight">Agrega al carrito</p>
            <p className="text-xs text-base-content/70">Elige cantidad/variantes.</p>
          </div>
        </li>

        <li className="flex gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-content">2</span>
          <div>
            <p className="font-medium leading-tight">Crea una cuenta</p>
            <p className="text-xs text-base-content/70">Nombre, correo y contraseña.</p>
          </div>
        </li>

        <li className="flex gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-content">3</span>
          <div>
            <p className="font-medium leading-tight">Paga con Mercado Pago</p>
            <p className="text-xs text-base-content/70">Crédito, débito o transferencia.</p>
          </div>
        </li>

        <li className="flex gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-content">4</span>
          <div>
            <p className="font-medium leading-tight">Confirmación</p>
            <p className="text-xs text-base-content/70">Te enviaremos un correo de confirmacion.</p>
          </div>
        </li>

        <li className="flex gap-2.5 sm:col-span-2">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-info text-[10px] font-bold text-info-content">5</span>
          <div>
            <p className="font-medium leading-tight">Coordinación de entrega</p>
            <p className="text-xs text-base-content/70">Nos contactamos contigo para el despacho.</p>
          </div>
        </li>
      </ol>

      <p className="mt-3 text-[11px] text-base-content/60">
        ¿Dudas? Escríbenos por <span className="underline decoration-base-content/30">Contacto</span>. Respondemos en 24–48 h hábiles.
      </p>
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
