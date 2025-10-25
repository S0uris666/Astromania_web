export const TYPE_FILTERS = [
  { value: "all", label: "Todo" },
  { value: "product", label: "Productos" },
  { value: "service", label: "Servicios" },
  { value: "activity", label: "Actividades" },
];

export const TYPE_LABEL = {
  product: "Producto",
  service: "Servicio",
  activity: "Actividad",
};

const PLACEHOLDER_PRODUCT = "https://placehold.co/900x600?text=Producto";
const PLACEHOLDER_SERVICE = "https://placehold.co/900x600?text=Servicio";
const PLACEHOLDER_ACTIVITY = "https://placehold.co/900x600?text=Actividad";

const PRICE_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

export const formatPrice = (value) =>
  typeof value === "number" ? PRICE_FORMATTER.format(value) : "A cotizar";

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

const coverFromPlaceholder = (type) => {
  if (type === "service") return { src: PLACEHOLDER_SERVICE, alt: "Servicio" };
  if (type === "activity") return { src: PLACEHOLDER_ACTIVITY, alt: "Actividad" };
  return { src: PLACEHOLDER_PRODUCT, alt: "Producto" };
};

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

  const type = String(item.type || "").toLowerCase();
  return coverFromPlaceholder(type);
};

export const filterItemsByType = (items, filterType) => {
  const safeItems = Array.isArray(items) ? items : [];

  if (filterType === "all") {
    return safeItems.filter((item) => item?.active !== false);
  }

  return safeItems.filter(
    (item) =>
      item?.active !== false &&
      String(item.type || "").toLowerCase() === filterType
  );
};

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

