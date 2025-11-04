import { Link } from "react-router-dom";

export function ComunidadHero() {
  

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),transparent_55%),_radial-gradient(circle_at_bottom,_rgba(147,51,234,0.12),transparent_45%),_linear-gradient(180deg,_#080B15,_#111827_60%,_#0B1120)]" />
      <div className="absolute inset-0 blur-[120px] opacity-40">
        <div className="mx-auto h-full max-w-4xl bg-gradient-to-br from-primary/40 via-indigo-500/40 to-fuchsia-500/30" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-6 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
            Comunidad Astromania
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Respuestas claras para tus preguntas sobre el universo
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            Explora explicaciones, pasos accionables y recursos recomendados por la comunidad.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contacto" className="btn btn-primary btn-lg shadow-xl shadow-primary/40">
              Enviar una nueva pregunta
            </Link>
            <Link
              to="/comunidad/red_divulgadores"
              className="btn btn-outline btn-lg border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              Conocer divulgadores
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ComunidadHero;
