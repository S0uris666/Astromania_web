/**
 * @param {{links: Array<{url: string, label: string}>, className?: string}} props
 */
export const LinksList = ({ links, className = "" }) => {
  if (!links.length) return null;

  return (
    <section
      className={`space-y-3 rounded-3xl border border-base-300/60 bg-base-100/95 p-5 shadow-sm ${className}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
        Enlaces relacionados
      </h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <a
            key={`${link.url}-${index}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline gap-2"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
};
