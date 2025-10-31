

export const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
};

const ensureUrlProtocol = (url) => {
  const normalized = normalizeText(url);
  if (!normalized) return "";
  return normalized.startsWith("http://") || normalized.startsWith("https://")
    ? normalized
    : `https://${normalized}`;
};

export const getLinkLabel = (label, url) => {
  const normalizedLabel = normalizeText(label);
  if (normalizedLabel) return normalizedLabel;

  const candidate = ensureUrlProtocol(url);
  if (!candidate) return "";

  try {
    const { hostname } = new URL(candidate);
    return hostname.replace(/^www\./, "");
  } catch {
    return normalizeText(url);
  }
};

export const buildProfileLinks = (links) =>
  (Array.isArray(links) ? links : [])
    .map((link) => {
      const href = ensureUrlProtocol(link?.url);
      if (!href) return null;
      return { url: href, label: getLinkLabel(link?.label, href) };
    })
    .filter(Boolean);

export const parseSpecializations = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return Array.from(
      new Set(value.map((item) => normalizeText(item)).filter(Boolean)),
    );
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];

    try {
      return parseSpecializations(JSON.parse(raw));
    } catch {
      return Array.from(
        new Set(
          raw
            .split(/[,;|]/g)
            .map((item) => normalizeText(item))
            .filter(Boolean),
        ),
      );
    }
  }

  if (typeof value === "object") {
    return parseSpecializations(Object.values(value));
  }

  return [];
};

export const getPrimaryImageUrl = (images) => {
  if (!Array.isArray(images)) return "";
  const entry = images.find((img) => normalizeText(img?.url));
  return entry?.url || "";
};

export const getInitials = (name) =>
  normalizeText(name)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
