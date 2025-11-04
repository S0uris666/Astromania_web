import { createPaymentPreference, getPaymentById } from "../services/payment.service.js";
import { sendConfirmationEmailIfNeeded } from "../utils/paymentEmail.js";

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
    const { data, id } = req.body;

    const paymentId =
      (data && (data.id || data.paymentId)) ||
      req.query["data.id"] ||
      req.query.id ||
      id;

    if (!paymentId) {
      return res.status(200).send("OK (sin paymentId)");
    }

    const payment = await getPaymentById(paymentId);
    await sendConfirmationEmailIfNeeded(payment);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).send("OK");
  }
};
