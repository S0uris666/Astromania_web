import {
  listServiceProducts,
  createServiceProduct as createServiceProductService,
  findServiceProductById,
  updateServiceProduct as updateServiceProductService,
  removeServiceProduct,
  userCanEditServiceProduct,
} from "../services/serviceProduct.service.js";
import { sendSuccess, sendError } from "../utils/utils.js";

export const getAllServiceProducts = async (_req, res) => {
  try {
    const data = await listServiceProducts();
    return sendSuccess(res, data);
  } catch (err) {
    console.error("getAllServiceProducts error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const createServiceProduct = async (req, res) => {
  try {
    if (!req.body?.title || !req.body?.type) {
      return sendError(res, 400, "title y type son obligatorios");
    }

    const type = String(req.body.type).trim().toLowerCase();
    if (!["product", "service", "activity"].includes(type)) {
      return sendError(
        res,
        400,
        "type debe ser 'product', 'service' o 'activity'"
      );
    }

    const result = await createServiceProductService(
      { body: req.body, files: req.files },
      req.user
    );

    if (result.error) {
      return sendError(res, 400, result.error, result.detail);
    }

    return sendSuccess(res, result.data, 201);
  } catch (err) {
    console.error("createServiceProduct error:", err);

    if (err?.code === 11000) {
      return sendError(res, 409, "Ya existe un registro con ese valor unico", err.keyValue);
    }

    return sendError(res, 500, "Server error");
  }
};

export const updateServiceProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await findServiceProductById(id);
    if (!doc) {
      return sendError(res, 404, "Producto/Servicio no encontrado");
    }

    if (!userCanEditServiceProduct(doc, req.user)) {
      return sendError(
        res,
        403,
        "No tienes permisos para editar este recurso"
      );
    }

    const result = await updateServiceProductService({
      id,
      body: req.body,
      files: req.files,
      doc,
    });

    if (result.error) {
      return sendError(res, 400, result.error, result.detail);
    }

    return sendSuccess(res, result.data);
  } catch (err) {
    console.error("updateServiceProduct error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const deleteServiceProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await findServiceProductById(id);
    if (!doc) {
      return sendError(res, 404, "Producto/Servicio no encontrado");
    }

    if (!userCanEditServiceProduct(doc, req.user)) {
      return sendError(
        res,
        403,
        "No tienes permisos para eliminar este recurso"
      );
    }

    await removeServiceProduct(doc);
    return sendSuccess(res, { message: "Eliminado correctamente" });
  } catch (err) {
    console.error("deleteServiceProduct error:", err);
    return sendError(res, 500, "Server error");
  }
};
