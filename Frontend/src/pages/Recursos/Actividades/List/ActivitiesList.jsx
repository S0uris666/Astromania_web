import { useContext, useEffect, useMemo, useState } from "react";
import ServiceProductContext from "../../../../context/serviceProducts/ServiceProductContext";
import { UserContext } from "../../../../context/user/UserContext";
import { filterItemsByType } from "./ActivitiesHelpers";
import { ActivitiesCard } from "./components/ActivitiesCard";
import { ActivitiesSkeleton } from "./components/ActivitiesSkeleton";

const ActivitiesList = () => {
  const { addToCart } = useContext(UserContext);
  const { serviceProduct = [], getSP } = useContext(ServiceProductContext);

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

  const activities = useMemo(() => filterItemsByType(items), [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <header className="mt-15 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
        <p className="text-base text-base-content/70 max-w-3xl">
          Descubre las actividades del catalogo de Astromania para colegios, empresas y familias. Todas las opciones muestran experiencias guiadas por nuestro equipo de divulgadores.
        </p>
      </header>

      {loading ? (
        <ActivitiesSkeleton />
      ) : !activities.length ? (
        <div className="rounded-xl border border-base-300 p-8 text-base-content/70 text-center">
          No encontramos actividades disponibles por ahora.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {activities.map((item) => (
            <ActivitiesCard
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

export default ActivitiesList;


