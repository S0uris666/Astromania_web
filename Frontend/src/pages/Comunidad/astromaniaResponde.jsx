import { useMemo, useState } from "react";
import { respuestasComunidad } from "../../data/ComunidadRespuestas.js";
import { ComunidadHero } from "./components/Hero.jsx";
import { CategoryFilters } from "./components/CategoryFilters.jsx";
import { ResponsesAccordion } from "./components/ResponsesAccordion.jsx";

export function AstromaniaResponde() {
  const [activeCategory, setActiveCategory] = useState("Todas");

  const categories = useMemo(() => {
    const set = new Set(respuestasComunidad.map((item) => item.categoria));
    return ["Todas", ...Array.from(set)];
  }, []);

  const respuestasFiltradas = useMemo(() => {
    if (activeCategory === "Todas") return respuestasComunidad;
    return respuestasComunidad.filter((item) => item.categoria === activeCategory);
  }, [activeCategory]);

  return (
    <main className="bg-base-200/40 text-base-content">
      <ComunidadHero categories={categories} featured={respuestasComunidad[0]} />

      <section className="container mx-auto px-4 py-16">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold">Respuestas destacadas</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Selecciona una categoria para explorar articulos guiados que resumen lo esencial de cada tema.
            </p>
          </div>
          <CategoryFilters
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </header>

        <ResponsesAccordion responses={respuestasFiltradas} />

      </section>
    </main>
  );
}

export default AstromaniaResponde;
