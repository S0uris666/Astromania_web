import bcrypt from "bcryptjs";
import slugify from "slugify";
import User from "../models/User.model.js";
import {
  cleanupCloudinary,
  normText,
  parseJSON,
  sanitizeLinks,
  sanitizePayload,
  uploadToCloudinary,
} from "../utils/utils.js";

export const listPublicUsers = async ({ role } = {}) => {
  const filter = { status: "published" };

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    filter.role = {
      $in: roles.map((r) => String(r || "").toLowerCase()),
    };
  }

  return User.find(filter)
    .select("-password -__v")
    .sort({ createdAt: -1 });
};

export const findUserBySlug = (slug) =>
  User.findOne({ slug, status: "published" }).select("-password -__v");

export const processProfileImages = async ({
  files = [],
  existingImages = [],
  removeImageIds = [],
}) => {
  let images = Array.isArray(existingImages) ? [...existingImages] : [];

  if (Array.isArray(removeImageIds) && removeImageIds.length) {
    images = images.filter((img) => !removeImageIds.includes(img.public_id));
  }

  if (!files.length) {
    return { images, uploadedIds: [], errors: [] };
  }

  const uploadJobs = files.map((file) =>
    uploadToCloudinary(file, "user-profiles")
  );
  const results = await Promise.allSettled(uploadJobs);

  const uploadedIds = [];
  const succeeded = [];
  const errors = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const { url, public_id } = result.value;
      uploadedIds.push(public_id);
      succeeded.push({ url, public_id, alt: "" });
    } else {
      errors.push(result.reason?.message || "upload error");
    }
  });

  if (succeeded.length) {
    images = images.concat(succeeded);
  }

  return { images, uploadedIds, errors };
};

const FIELD_MAPPER = {
  username: (v) => normText(v),
  profesion: (v) => normText(v),
  especializacion: (v) => parseJSON(v, v),
  address: (v) => normText(v),
  city: (v) => normText(v),
  country: (v) => normText(v),
  phone: (v) => normText(v),
  description: (v) => normText(v),
  links: (v) => sanitizeLinks(parseJSON(v, v)),
  email: (v) => {
    const value = normText(v);
    return value ? value.toLowerCase() : value;
  },
  publicEmail: (v) => {
    const value = normText(v);
    return value ? value.toLowerCase() : value;
  },
};

export const updateProfile = async ({
  userId,
  body = {},
  files = [],
  requester,
}) => {
  const existing = await User.findById(userId);
  if (!existing) {
    return { status: 404, error: "User not found" };
  }

  const removeImageIds = parseJSON(body.removeImageIds, body.removeImageIds);

  const {
    images,
    uploadedIds,
    errors: uploadErrors,
  } = await processProfileImages({
    files,
    existingImages: existing.images,
    removeImageIds: Array.isArray(removeImageIds) ? removeImageIds : [],
  });

  if (uploadErrors.length) {
    await cleanupCloudinary(uploadedIds);
    return {
      error: "Error subiendo una o mas imagenes",
      detail: uploadErrors,
    };
  }

  const updates = {};

  Object.entries(FIELD_MAPPER).forEach(([key, parser]) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      updates[key] = parser(body[key]);
    }
  });

  if (updates.username) {
    updates.slug = slugify(updates.username, { lower: true, strict: true });
  }

  const requesterRole = String(requester?.role || "").toLowerCase();
  const requesterId = requester?.id || requester?._id || null;
  const isSelf =
    requesterId && String(requesterId) === String(userId);
  const canManageStatus =
    requesterRole === "admin" ||
    (requesterRole === "superuser" && isSelf);

  if (updates.email && requesterRole !== "admin") {
    delete updates.email;
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "status") &&
    canManageStatus
  ) {
    const statusValue = String(body.status || "").toLowerCase();
    if (["draft", "published"].includes(statusValue)) {
      updates.status = statusValue;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "password") && body.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(body.password, salt);
  }

  updates.images = images;

  const sanitized = sanitizePayload(updates);

  try {
    const updated = await User.findByIdAndUpdate(userId, sanitized, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!updated) {
      await cleanupCloudinary(uploadedIds);
      return { status: 404, error: "User not found" };
    }

    if (Array.isArray(removeImageIds) && removeImageIds.length) {
      await cleanupCloudinary(removeImageIds);
    }

    return { user: updated };
  } catch (error) {
    await cleanupCloudinary(uploadedIds);
    throw error;
  }
};
