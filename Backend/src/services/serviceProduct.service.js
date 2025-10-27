import slugify from "slugify";
import ServiceProductItem from "../models/ServiceProduct.model.js";
import {
  canEdit,
  cleanupCloudinary,
  normText,
  parseJSON,
  sanitizeLinks,
  sanitizeLocations,
  sanitizeTags,
  sanitizePayload,
  toBool,
  toNum,
  uploadToCloudinary,
} from "../utils/utils.js";

const buildImagesWithAlt = (files, alts = []) =>
  files.map((img, idx) => ({
    url: img.url,
    public_id: img.public_id,
    alt: typeof alts?.[idx] === "string" ? alts[idx].trim() : "",
  }));

const processUploads = async (files = []) => {
  if (!files.length) return { uploadedIds: [], images: [], errors: [] };

  const uploads = files.map((file) =>
    uploadToCloudinary(file, "service-products")
  );
  const results = await Promise.allSettled(uploads);

  const uploadedIds = [];
  const images = [];
  const errors = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const { url, public_id } = result.value;
      uploadedIds.push(public_id);
      images.push({ url, public_id, alt: "" });
    } else {
      errors.push(result.reason?.message || "upload error");
    }
  });

  return { uploadedIds, images, errors };
};

const basePayload = ({ body, images, userId }) => {
  const title = normText(body.title);
  const type = normText(body.type);

  const tagsInput = parseJSON(body.tags, body.tags);
  const locationsInput = parseJSON(body.locations, body.locations);
  const linksInput = parseJSON(body.links, body.links);
  const mpMeta = parseJSON(body.mpMetadata, undefined);
  const alts = parseJSON(body.alts, []);

  const imageEntries = buildImagesWithAlt(images, alts);

  const payload = {
    title,
    slug: normText(body.slug) || slugify(title ?? "", { lower: true, strict: true }),
    type,
    category: normText(body.category),
    shortDescription: normText(body.shortDescription),
    description: normText(body.description),
    location: normText(body.location),
    price: toNum(body.price),
    currency: normText(body.currency) || "CLP",
    active: toBool(body.active, true),
    stock: toNum(body.stock, 0),
    delivery: normText(body.delivery),
    images: imageEntries,
    durationMinutes: toNum(body.durationMinutes),
    capacity: toNum(body.capacity),
    locations: sanitizeLocations(locationsInput),
    tags: sanitizeTags(tagsInput),
    links: sanitizeLinks(linksInput),
    mpMetadata: mpMeta,
    createdBy: userId || undefined,
  };

  const cleaned = sanitizePayload(payload);

  if (cleaned.type === "activity") {
    delete cleaned.price;
    delete cleaned.currency;
    delete cleaned.stock;
    delete cleaned.delivery;
    delete cleaned.durationMinutes;
    delete cleaned.capacity;
    cleaned.locations = [];
    delete cleaned.mpMetadata;
  }

  return cleaned;
};

export const listServiceProducts = () => ServiceProductItem.find({});

export const createServiceProduct = async ({ body, files }, user) => {
  const { uploadedIds, images, errors } = await processUploads(files);

  if (errors.length) {
    await cleanupCloudinary(uploadedIds);
    return { error: "Error subiendo una o mas imagenes", detail: errors };
  }

  const payload = basePayload({ body, images, userId: user?.id });
  const created = await ServiceProductItem.create(payload);
  return { data: created };
};

export const findServiceProductById = (id) => ServiceProductItem.findById(id);

export const updateServiceProduct = async ({ id, body, files, doc }) => {
  const { uploadedIds, images: newImages, errors } = await processUploads(files);

  if (errors.length) {
    await cleanupCloudinary(uploadedIds);
    return { error: "Error subiendo una o mas imagenes", detail: errors };
  }

  const removePublicIds = parseJSON(body?.removePublicIds, []);
  const previousImages = Array.isArray(doc.images) ? [...doc.images] : [];
  let images = previousImages.filter(
    (img) => !removePublicIds.includes(img.public_id)
  );
  if (newImages.length) images = images.concat(newImages);

  const payload = { images };

  const hasTitle = Object.prototype.hasOwnProperty.call(body, "title");
  const hasSlug = Object.prototype.hasOwnProperty.call(body, "slug");

  if (hasTitle) {
    const title = normText(body.title);
    if (title) {
      payload.title = title;
      payload.slug =
        normText(body.slug) || slugify(title, { lower: true, strict: true });
    }
  } else if (hasSlug) {
    payload.slug = normText(body.slug) || doc.slug;
  }

  const FIELDS = {
    type: (v) => normText(v),
    category: (v) => normText(v),
    shortDescription: (v) => normText(v),
    description: (v) => normText(v),
    location: (v) => normText(v),
    currency: (v) => normText(v),
    delivery: (v) => normText(v),
    price: (v) => toNum(v),
    stock: (v) => toNum(v, 0),
    durationMinutes: (v) => toNum(v),
    capacity: (v) => toNum(v),
    active: (v) => toBool(v, doc.active),
    locations: (v) => sanitizeLocations(parseJSON(v, v)),
    tags: (v) => sanitizeTags(parseJSON(v, v)),
    links: (v) => sanitizeLinks(parseJSON(v, v)),
    mpMetadata: (v) => parseJSON(v, undefined),
  };

  for (const [key, parse] of Object.entries(FIELDS)) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      payload[key] = parse(body[key], { doc });
    }
  }

  const targetType = payload.type || doc.type;
  if (targetType === "activity") {
    delete payload.price;
    delete payload.currency;
    delete payload.stock;
    delete payload.delivery;
    delete payload.durationMinutes;
    delete payload.capacity;
    payload.locations = [];
    delete payload.mpMetadata;
  }

  const sanitized = sanitizePayload(payload);

  const updated = await ServiceProductItem.findByIdAndUpdate(id, sanitized, {
    new: true,
    runValidators: true,
  });

  if (Array.isArray(removePublicIds) && removePublicIds.length) {
    await cleanupCloudinary(removePublicIds);
  }

  return { data: updated };
};

export const removeServiceProduct = async (doc) => {
  await ServiceProductItem.findByIdAndDelete(doc.id);
  const publicIds = (doc.images || [])
    .map((image) => image.public_id)
    .filter(Boolean);
  await cleanupCloudinary(publicIds);
};

export const userCanEditServiceProduct = (doc, user) => canEdit(doc, user);
