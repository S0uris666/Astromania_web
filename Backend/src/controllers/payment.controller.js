import { createPaymentPreference, getPaymentById } from "../services/payment.service.js";
import { sendConfirmationEmailIfNeeded } from "../utils/paymentEmail.js";

const extractWebhookPaymentId = (req) => {
  if (!req) return "";
  const body = req.body || {};
  const query = req.query || {};

  const candidate =
    body?.data?.id ??
    body?.data?.paymentId ??
    body?.payment_id ??
    body?.paymentId ??
    query?.payment_id ??
    query?.paymentId ??
    query["data.id"] ??
    query.id ??
    body?.id ??
    null;

  return candidate ? String(candidate).trim() : "";
};

const isPaymentTopic = (req) => {
  const topic =
    req?.body?.topic ||
    req?.body?.type ||
    req?.query?.topic ||
    req?.query?.type ||
    "";
  const action = req?.body?.action || "";

  const topicLower = typeof topic === "string" ? topic.toLowerCase() : "";
  const actionLower = typeof action === "string" ? action.toLowerCase() : "";

  if (!topicLower && !actionLower) return true; // Legacy notifications without topic/action
  if (topicLower.includes("payment")) return true;
  if (actionLower.includes("payment")) return true;
  return false;
};

// Crea preferencia
export const createPreference = async (req, res) => {
  try {
    const body = req.body;

    const preference = await createPaymentPreference({
      ...body,
      external_reference:
        body.external_reference ??
        `${body?.metadata?.eventId || "event"}-${body?.metadata?.userId || "user"}-${Date.now()}`,
    });

    res.json(preference);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      cause: error?.cause,
    });
  }
};

// Estado de pago por ID
export const getStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const data = await getPaymentById(paymentId);
    res.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      transaction_amount: data.transaction_amount,
      currency_id: data.currency_id,
      payer: data.payer,
      order: data.order,
      external_reference: data.external_reference,
      metadata: data.metadata,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const successReturn = async (req, res) => {
  try {
    const paymentId = req.query.payment_id || req.query.id;
    if (paymentId) {
      const payment = await getPaymentById(paymentId);
      await sendConfirmationEmailIfNeeded(payment);
    }
  } catch (error) {
    console.error("Error handling successReturn:", error);
  }

  res.send("Pago aprobado. Puedes cerrar esta ventana.");
};

export const failureReturn = (req, res) => {
  res.send("Pago rechazado o fallido.");
};

export const pendingReturn = (req, res) => {
  res.send("Pago pendiente.");
};

export const webhook = async (req, res) => {
  try {
    if (!isPaymentTopic(req)) {
      return res.status(200).send("OK (topic no es de pago)");
    }

    const paymentId = extractWebhookPaymentId(req);
    if (!paymentId) {
      return res.status(200).send("OK (sin paymentId)");
    }

    if (!/^\d+$/.test(paymentId)) {
      console.warn(`Webhook ignorado: paymentId no numerico (${paymentId})`);
      return res.status(200).send("OK (paymentId no valido)");
    }

    const payment = await getPaymentById(paymentId);
    await sendConfirmationEmailIfNeeded(payment);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).send("OK");
  }
};
