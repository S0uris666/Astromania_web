/**
 * @param {{images: Array<{src: string, thumb: string, alt: string}>, selectedIndex: number, onSelectImage: (idx: number) => void}} props
 */
export const ServiceProductGallery = ({
  images,
  selectedIndex,
  onSelectImage,
}) => {
  if (!images.length) return null;

  const selectedImage = images[selectedIndex] || images[0];

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-200/70 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_65%)] opacity-60" />
        {selectedImage ? (
          <img
            key={selectedImage.src}
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[520px] w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                type="button"
                key={`${image.src}-${index}`}
                onClick={() => onSelectImage(index)}
                className={`relative aspect-video overflow-hidden rounded-2xl border ${
                  isActive ? "border-primary ring-2 ring-primary/40" : "border-base-300/60"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
