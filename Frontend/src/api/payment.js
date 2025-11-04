import axios from "axios";
import client from "./client.js";

const API = import.meta.env.VITE_BACKEND_URL;

export const createPaymentPreference = async (items, options = {}) => {
  try {
    const {
      success,
      failure,
      pending,
      payerName,
      payerEmail,
      metadata,
    } = options || {};

    const normalizedItems = items.map((item) => ({
      title: item.title,
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.price || 0),
      currency_id: "CLP",
      description: item.description || item.title,
    }));

    const preferenceData = {
      items: normalizedItems,
      back_urls: {
        success: success || `${window.location.origin}/payment/success`,
        failure: failure || `${window.location.origin}/payment/failure`,
        pending: pending || `${window.location.origin}/payment/pending`,
      },
      auto_return: "approved",
      notification_url: `${API}/payments/notification`,
      payer: {
        name: payerName || "",
        email: payerEmail || "",
      },
    };

    if (metadata && Object.keys(metadata).length) {
      preferenceData.metadata = metadata;
    }

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
    const response = await axios.get(`${API}/payments/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};
