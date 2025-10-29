const SocialLinksEditor = ({ links, onChange }) => {
  const handleUpdate = (index, field, value) => {
    onChange(
      links.map((link, idx) =>
        idx === index ? { ...link, [field]: value } : link
      )
    );
  };

  const handleAdd = () => {
    onChange([...links, { label: "", url: "" }]);
  };

  const handleRemove = (index) => {
    onChange(links.filter((_, idx) => idx !== index));
  };

  return (
    <section className="card bg-base-200 shadow-md">
      <div className="card-body space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-lg">Enlaces sociales</h2>
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAdd}>
            Añadir enlace
          </button>
        </div>

        {links.length === 0 ? (
          <p className="text-sm text-base-content/70">
            Añade tus redes, portafolio o sitios relevantes para que la comunidad pueda seguirte.
          </p>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={`link-${index}`}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
              >
                <label className="form-control">
                  <span className="label-text">Etiqueta</span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdate(index, "label", e.target.value)}
                    className="input input-bordered"
                    placeholder="Instagram, Sitio web..."
                  />
                </label>

                <label className="form-control">
                  <span className="label-text">URL</span>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdate(index, "url", e.target.value)}
                    className="input input-bordered"
                    placeholder="https://..."
                  />
                </label>

                <button
                  type="button"
                  className="btn btn-sm btn-error mt-2 sm:mt-0"
                  onClick={() => handleRemove(index)}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialLinksEditor;

