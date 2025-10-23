import client, { API_BASE_URL } from "./client.js";

const joinBasePath = (base, path) => {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const ensureAbsoluteURL = (url) => {
  if (/^https?:\/\//i.test(url) || typeof window === "undefined") return url;
  const prefix = window.location.origin.replace(/\/+$/, "");
  const suffix = url.startsWith("/") ? url : `/${url}`;
  return `${prefix}${suffix}`;
};

const envWebhook = (import.meta.env.VITE_MP_WEBHOOK_URL || "").trim();
const notificationURL = envWebhook || ensureAbsoluteURL(joinBasePath(API_BASE_URL, "/payments/notification"));

// Crear preferencia de pago
export const createPaymentPreference = async (items, backUrls = {}) => {
  try {
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity || 1,
        unit_price: item.price,
        currency_id: "CLP",
        description: item.description || item.title
      })),
      back_urls: {
        success: backUrls.success || `${window.location.origin}/payment/success`,
        failure: backUrls.failure || `${window.location.origin}/payment/failure`,
        pending: backUrls.pending || `${window.location.origin}/payment/pending`,
      },
      auto_return: "approved",
      notification_url: notificationURL,
      payer: {
        name: backUrls.payerName || "",
        email: backUrls.payerEmail || ""
      }
    };

    const { data } = await client.post(`/payments/create_preference`, preferenceData);
    return data;
  } catch (error) {
    console.error("Error creating payment preference:", error);
    throw error;
  }
};

// Obtener estado del pago
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await client.get(`/payments/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};
