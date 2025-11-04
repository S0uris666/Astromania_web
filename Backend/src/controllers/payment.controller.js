import { createPaymentPreference, getPaymentById } from "../services/payment.service.js";
import { sendPurchaseConfirmationMail } from "../services/mailer.service.js";
import User from "../models/User.model.js";

const processedPayments = new Set();

const formatCurrency = (value, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(Number(value || 0));

const parseItemsFromMetadata = (payment) => {
  const metadataItems = payment?.metadata?.orderItems;
  if (!metadataItems) return [];
  try {
    const parsed = JSON.parse(metadataItems);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      title: item.title,
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unit_price || item.price || 0),
    }));
  } catch (error) {
    console.error("Error parsing orderItems metadata:", error);
    return [];
  }
};

const sendConfirmationEmailIfNeeded = async (payment) => {
  try {
    if (!payment?.id) return;
    if (processedPayments.has(payment.id)) return;
    if (payment.status !== "approved") return;

    const userId = payment?.metadata?.userId;
    let payerEmail =
      payment?.metadata?.buyerEmail ||
      payment?.payer?.email ||
      payment?.payer?.payer_email ||
      "";

    if (!payerEmail && userId) {
      try {
        const user = await User.findById(userId).select("email");
        if (user?.email) {
          payerEmail = user.email;
        }
      } catch (dbError) {
        console.error("Error fetching user email:", dbError);
      }
    }

    const teamEmail = process.env.SMTP_JP;

    if (!payerEmail && !teamEmail) return;

    const currencyId = payment?.currency_id || "CLP";
    const orderItems = parseItemsFromMetadata(payment);

    const itemsHtml = orderItems.length
      ? orderItems
          .map(
            (item) =>
              `<li><strong>${item.title}</strong> x${item.quantity} - ${formatCurrency(
                item.unit_price,
                currencyId,
              )}</li>`,
          )
          .join("")
      : "<li>Tu compra se registró correctamente.</li>";

    const totalAmount =
      payment?.transaction_amount ??
      orderItems.reduce(
        (total, current) => total + (current.unit_price || 0) * (current.quantity || 0),
        0,
      );

    const buyerName =
      payment?.metadata?.buyerName ||
      payment?.payer?.name ||
      "";

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #111827;">
        <h2 style="color: #2563eb;">¡Gracias por tu compra${buyerName ? `, ${buyerName}` : ""}!</h2>
        <p>Hemos recibido tu pago correctamente. Aquí tienes un resumen:</p>
        <ul>
          ${itemsHtml}
        </ul>
        <p><strong>Total pagado:</strong> ${formatCurrency(totalAmount, currencyId)}</p>
        <p style="margin-top: 16px;">Si necesitas asistencia, escríbenos a contacto@astromania.cl.</p>
        <p style="margin-top: 24px;">Equipo Astromanía</p>
      </div>
    `;

    await sendPurchaseConfirmationMail({
      to: payerEmail || teamEmail,
      subject: "Confirmación de compra | Astromanía",
      html,
      bcc: payerEmail && teamEmail && payerEmail !== teamEmail ? teamEmail : undefined,
    });

    processedPayments.add(payment.id);
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error);
  }
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