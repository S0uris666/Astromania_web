/**
 * @param {{links: Array<{url: string, label: string}>}} props
 */
export const LinksList = ({ links }) => {
  if (!links.length) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
        Enlaces relacionados
      </h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <a
            key={`${link.url}-${index}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

