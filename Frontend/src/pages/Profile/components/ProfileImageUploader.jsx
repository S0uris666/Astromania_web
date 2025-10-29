import { useEffect, useMemo } from "react";

const ProfileImageUploader = ({
  existingImages,
  newFiles,
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}) => {
  const previews = useMemo(
    () =>
      newFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [newFiles]
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews]
  );

  return (
    <section className="card bg-base-200 shadow-md">
      <div className="card-body space-y-4">
        <h2 className="card-title text-lg">Galería e imágenes</h2>
        <p className="text-sm text-base-content/70">
          Sube imágenes que representen tu trabajo (máximo 6). Las primeras se usarán como portada.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {existingImages.map((image) => (
            <figure
              key={image.public_id}
              className="relative rounded-xl overflow-hidden border border-base-300 bg-base-100"
            >
              <img
                src={image.url}
                alt={image.alt || "Imagen del divulgador"}
                className="w-full h-32 object-cover"
                loading="lazy"
              />
              <button
                type="button"
                className="btn btn-xs btn-error absolute top-2 right-2"
                onClick={() => onRemoveExisting(image.public_id)}
              >
                Quitar
              </button>
            </figure>
          ))}

          {previews.map((preview, index) => (
            <figure
              key={preview.url}
              className="relative rounded-xl overflow-hidden border border-dashed border-base-300 bg-base-100"
            >
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                className="btn btn-xs btn-error absolute top-2 right-2"
                onClick={() => onRemoveNew(index)}
              >
                Quitar
              </button>
            </figure>
          ))}
        </div>

        <label className="form-control">
          <span className="label-text">Agregar nuevas imágenes</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              onAddFiles(event.target.files);
              event.target.value = "";
            }}
            className="file-input file-input-bordered"
          />
        </label>
      </div>
    </section>
  );
};

export default ProfileImageUploader;
