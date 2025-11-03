const PLACEHOLDER_PRODUCT = "https://placehold.co/1200x800?text=Producto";
const PLACEHOLDER_SERVICE = "https://placehold.co/1200x800?text=Servicio";
const PLACEHOLDER_ACTIVITY = "https://placehold.co/1200x800?text=Actividad";

export const TYPE_LABEL = {
  product: "Producto",
  service: "Servicio",
  activity: "Actividad",
};

const buildCloudinaryUrl = (urlOrId, width, height) => {
  if (!urlOrId) return null;
  const sizeSegment = `f_auto,q_auto,c_pad,b_auto:predominant,w_${width},h_${height}`;

  if (typeof urlOrId === "string" && urlOrId.includes("/upload/")) {
    return urlOrId.replace("/upload/", `/upload/${sizeSegment}/`);
  }

  const cloud = import.meta.env.VITE_CLD_CLOUD_NAME;
  if (cloud) {
    const safeId = String(urlOrId).replace(/^\//, "");
    return `https://res.cloudinary.com/${cloud}/image/upload/${sizeSegment}/${safeId}`;
  }

  return null;
};

const withFallback = (item) => {
  const type = String(item?.type || "").toLowerCase();
  if (type === "service") return PLACEHOLDER_SERVICE;
  if (type === "activity") return PLACEHOLDER_ACTIVITY;
  return PLACEHOLDER_PRODUCT;
};

export const normalizeImages = (item = {}) => {
  const images = Array.isArray(item.images) ? item.images : [];

  if (!images.length) {
    const fallback = withFallback(item);
    return [
      {
        src: fallback,
        thumb: fallback,
        alt: item?.title || "Imagen",
      },
    ];
  }

  return images
    .map((entry) => {
      const base =
        (entry && typeof entry === "object" && (entry.url || entry.public_id)) ||
        entry;
      if (!base) return null;

      const large = buildCloudinaryUrl(base, 1400, 900);
      const thumb = buildCloudinaryUrl(base, 360, 360);

      return {
        src: large || String(base),
        thumb: thumb || String(base),
        alt:
          (entry && typeof entry === "object" && entry.alt) ||
          item?.title ||
          "Imagen",
      };
    })
    .filter(Boolean);
};

export const normalizeLinks = (links = []) =>
  links
    .map((link) => {
      if (typeof link === "string") {
        const url = link.trim();
        return url ? { label: "Ver recurso", url } : null;
      }
      if (link && typeof link === "object") {
        const url = String(link.url || "").trim();
        if (!url) return null;
        const label = (link.label || link.title || "Ver recurso").trim();
        return {
          label: label || "Ver recurso",
          url,
        };
      }
      return null;
    })
    .filter(Boolean);

export const formatPrice = (value) => {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value);
};

export const buildBreadcrumbs = (title) => [
  { label: "Inicio", to: "/" },
  { label: "Recursos", to: "/recursos" },
  { label: "Actividades", to: "/recursos/actividades" },
  { label: title || "(Sin titulo)" },
];


