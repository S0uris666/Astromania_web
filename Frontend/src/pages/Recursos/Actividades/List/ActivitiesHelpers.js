const PLACEHOLDER_ACTIVITY = "https://placehold.co/1200x800?text=Actividad";

export const TYPE_LABEL = {
  activity: "Actividad",
};

const PRICE_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

export const formatPrice = (value) =>
  typeof value === "number" ? PRICE_FORMATTER.format(value) : null;

const buildCloudinaryUrl = (value, width, height) => {
  if (!value) return null;

  const sizeSegment = `f_auto,q_auto,c_pad,b_auto:predominant,w_${width},h_${height}`;

  if (typeof value === "string" && value.includes("/upload/")) {
    return value.replace("/upload/", `/upload/${sizeSegment}/`);
  }

  const cloudName = import.meta.env.VITE_CLD_CLOUD_NAME;
  if (cloudName) {
    const safeId = String(value).replace(/^\//, "");
    return `https://res.cloudinary.com/${cloudName}/image/upload/${sizeSegment}/${safeId}`;
  }

  return null;
};

const coverFromPlaceholder = () => ({
  src: PLACEHOLDER_ACTIVITY,
  alt: "Actividad",
});

export const getCoverData = (item = {}) => {
  const first = Array.isArray(item.images) ? item.images[0] : null;

  if (first && typeof first === "object") {
    const base = first.url || first.public_id;
    if (base) {
      const src = buildCloudinaryUrl(base, 1200, 800) || base;
      if (src) {
        return {
          src,
          alt: first.alt || item.title || "Imagen",
        };
      }
    }
  }

  if (first && typeof first === "string") {
    const src = buildCloudinaryUrl(first, 1200, 800) || first;
    return {
      src,
      alt: item.title || "Imagen",
    };
  }

  return coverFromPlaceholder();
};

export const filterItemsByType = (items) =>
  (Array.isArray(items) ? items : []).filter(
    (item) =>
      item?.active !== false &&
      String(item.type || "").toLowerCase() === "activity"
  );

export const buildServiceInfo = (item = {}) => {
  const info = [];

  if (item.durationMinutes) {
    info.push(`Duracion: ${item.durationMinutes} min`);
  }

  if (item.capacity) {
    info.push(`Capacidad: ${item.capacity} personas`);
  }

  if (Array.isArray(item.locations) && item.locations.length) {
    info.push(`Ubicaciones: ${item.locations.join(", ")}`);
  }

  return info;
};

