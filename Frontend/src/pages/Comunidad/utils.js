export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const extractYoutubeId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.hostname.includes("youtube.com")) {
      const direct = parsed.searchParams.get("v");
      if (direct) return direct;
      const parts = parsed.pathname.split("/");
      const embedIndex = parts.findIndex((part) => part === "embed" || part === "shorts");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
};

export const buildYoutubeEmbed = (id) => `https://www.youtube.com/embed/${id}?rel=0`;
