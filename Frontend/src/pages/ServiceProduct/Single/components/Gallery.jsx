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
      <div className="relative rounded-2xl overflow-hidden border border-base-300 bg-base-200">
        {selectedImage ? (
          <img
            key={selectedImage.src}
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="w-full h-full object-cover max-h-[480px]"
            loading="lazy"
          />
        ) : null}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                type="button"
                key={`${image.src}-${index}`}
                onClick={() => onSelectImage(index)}
                className={`relative aspect-video rounded-xl overflow-hidden border ${
                  isActive ? "border-primary ring-2 ring-primary/40" : "border-base-300"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="w-full h-full object-cover"
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
