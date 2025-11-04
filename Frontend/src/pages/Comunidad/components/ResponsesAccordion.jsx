import { FiArrowUpRight, FiClock, FiTag } from "react-icons/fi";
import { buildYoutubeEmbed, extractYoutubeId, formatDate } from "../utils.js";

const getVideoEntries = (respuesta) => {
  const manualVideos =
    respuesta.videos?.map((video) => ({
      ...video,
      youtubeId: extractYoutubeId(video.url),
    })) ?? [];

  const recursoVideos = [];
  const recursosRestantes = [];

  (respuesta.recursos ?? []).forEach((item) => {
    if (item.url.includes("youtu")) {
      recursoVideos.push({
        titulo: item.etiqueta ?? "Video recomendado",
        url: item.url,
        youtubeId: extractYoutubeId(item.url),
      });
    } else {
      recursosRestantes.push(item);
    }
  });

  const videoEntries = [...manualVideos, ...recursoVideos].filter((video) => Boolean(video.youtubeId));

  return { videoEntries, recursosRestantes };
};

export function ResponsesAccordion({ responses }) {
  return (
    <div className="mt-12 space-y-6">
      {responses.map((respuesta) => {
        const { videoEntries, recursosRestantes } = getVideoEntries(respuesta);

        return (
          <div
            key={respuesta.id}
            className="collapse collapse-arrow border border-base-content/10 bg-base-100 shadow-lg"
          >
            <input type="checkbox" />
            <div className="collapse-title space-y-2 py-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                <span className="badge badge-outline border-primary/40 text-primary">{respuesta.categoria}</span>
                <span className="inline-flex items-center gap-1 text-base-content/60">
                  <FiClock className="h-3.5 w-3.5" />
                  {formatDate(respuesta.publicadoEl)}
                </span>
                <span className="inline-flex items-center gap-1 text-base-content/60">
                  <FiTag className="h-3.5 w-3.5" />
                  {respuesta.autor}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-base-content sm:text-2xl">{respuesta.pregunta}</h3>
              <p className="text-sm text-base-content/70 sm:text-base">{respuesta.resumen}</p>
            </div>

            <div className="collapse-content space-y-6">
              {videoEntries.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {videoEntries.map((video) => (
                    <div
                      key={video.url}
                      className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/50"
                    >
                      <div className="aspect-video w-full">
                        <iframe
                          src={buildYoutubeEmbed(video.youtubeId)}
                          title={video.titulo ?? `Video relacionado con ${respuesta.pregunta}`}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="h-full w-full"
                        />
                      </div>
                      {video.titulo ? (
                        <p className="px-4 py-3 text-sm font-medium text-base-content/80">{video.titulo}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="space-y-4">
                {respuesta.secciones.map((section) => (
                  <article
                    key={section.titulo}
                    className="rounded-2xl border border-base-content/10 bg-base-200/60 p-6"
                  >
                    <h4 className="text-lg font-semibold text-base-content">{section.titulo}</h4>
                    <p className="mt-3 text-sm text-base-content/70">{section.contenido}</p>
                    {section.imagen ? (
                      <figure className="mt-4 flex justify-center">
                        <img
                          src={section.imagen}
                          alt={section.titulo}
                          className="w-full max-w-md rounded-md border border-base-content/10 object-cover shadow-sm"
                        />
                      </figure>
                    ) : null}
                  </article>
                ))}
              </div>

              {recursosRestantes.length ? (
                <footer className="flex flex-wrap gap-3">
                  {recursosRestantes.map((recurso) => (
                    <a
                      key={recurso.url}
                      href={recurso.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline border-primary/40 text-primary hover:border-primary hover:bg-primary hover:text-primary-content"
                    >
                      {recurso.etiqueta}
                      <FiArrowUpRight />
                    </a>
                  ))}
                </footer>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResponsesAccordion;
