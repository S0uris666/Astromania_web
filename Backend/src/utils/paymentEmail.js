import { sendPurchaseConfirmationMail } from "../services/mailer.service.js";
import User from "../models/User.model.js";

const processedPayments = new Set();

const formatCurrency = (value, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(Number(value || 0));

const unwrapSerializedString = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    if (value.$oid) {
      return String(value.$oid).trim();
    }
    return "";
  }
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
};

const extractMetadata = (payment) => {
  const raw = payment?.metadata;
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error parsing payment metadata:", error);
      return {};
    }
  }
  return raw;
};

const parseItemsFromMetadata = (metadata) => {
  const metadataItems = metadata?.orderItems;
  if (!metadataItems) return [];
  try {
    let rawItems = typeof metadataItems === "string" ? metadataItems : JSON.stringify(metadataItems);
    let parsed = JSON.parse(rawItems);
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
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

const buildEmailHtml = (buyerName, itemsHtml, totalAmount, currencyId) => {
  const orderUrl = "https://astromania.cl/mi-pedido"; // opcional: reemplaza con tu URL real
  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Pago recibido - Astromanía</title>
    <style>
      /* Algunos clientes respetan <style> y otros solo inline: usamos ambos */
      @media (max-width:600px){
        .container{ width:100% !important; }
        .content{ padding:20px !important; }
        .btn{ width:100% !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f3f4f6;">
    <!-- Preheader (texto previo en la bandeja) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      ¡Pago recibido! Gracias por tu compra en Astromanía.
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:100%; background:#ffffff; border-radius:12px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="left" style="background:#111827; padding:20px 24px;">
                <table width="100%" role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <div style="color:#ffffff; font:700 18px/1.2 Arial, Helvetica, sans-serif;">Astromanía</div>
                      <div style="color:#9CA3AF; font:400 12px/1.4 Arial, Helvetica, sans-serif;">Confirmación de pago</div>
                    </td>
                    <td align="right">
                      <span style="display:inline-block; padding:6px 10px; background:#9c25eb; color:#fff; border-radius:999px; font:700 11px/1 Arial, Helvetica, sans-serif; text-transform:uppercase;">
                        Pago recibido
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contenido -->
            <tr>
              <td class="content" style="padding:28px; font-family:Arial, Helvetica, sans-serif; color:#111827;">
                <h2 style="margin:0 0 8px 0; font-size:22px; line-height:1.3; color:#9c25eb;">
                  ¡Gracias por tu compra${buyerName ? `, ${buyerName}` : ""}!
                </h2>
                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#374151;">
                  Hemos recibido tu pago correctamente. Aquí tienes el resumen:
                </p>

                <!-- Bloque items -->
                <div style="margin:0 0 16px 0; border:1px solid #E5E7EB; border-radius:10px; padding:14px;">
                  <p style="margin:0 0 8px 0; font-size:13px; color:#6B7280;">Productos</p>
                  <ul style="padding-left:18px; margin:0; color:#111827; font-size:14px; line-height:1.6;">
                    ${itemsHtml}
                  </ul>
                </div>

                <p style="margin:8px 0 20px 0; font-size:15px; line-height:1.6;">
                  <strong>Total pagado:</strong> ${formatCurrency(totalAmount, currencyId)}
                </p>

                <!-- Botón CTA -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">
                  <tr>
                    <td>
                      <a href="${orderUrl}"
                         class="btn"
                         style="display:inline-block; background:#9c25eb; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:10px; font:700 14px/1 Arial, Helvetica, sans-serif;">
                        Ver mi pedido
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Soporte -->
                <p style="margin:18px 0 0 0; font-size:13px; color:#6B7280; line-height:1.6;">
                  Si necesitas asistencia, escríbenos a
                  <a href="mailto:contacto@astromania.cl" style="color:#6B7280; text-decoration:underline;">contacto@astromania.cl</a>.
                </p>

                <p style="margin:24px 0 0 0; font-size:13px; color:#6B7280;">
                  Equipo Astromanía
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px 28px 28px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">
                <hr style="border:none; border-top:1px solid #E5E7EB; margin:0 0 12px 0;">
                <p style="margin:0;">Este es un mensaje automático. Por favor, no respondas a este correo.</p>
                <p style="margin:4px 0 0 0;">© ${new Date().getFullYear()} Astromanía. Todos los derechos reservados.</p>
              </td>
            </tr>
          </table>

          <div style="height:24px;"></div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};


export const resetProcessedPayments = () => processedPayments.clear();

export const sendConfirmationEmailIfNeeded = async (payment) => {
  try {
    if (!payment?.id) return;
    if (processedPayments.has(payment.id)) return;
    if (payment.status !== "approved") return;

    const metadata = extractMetadata(payment);
    const userIdRaw = metadata?.userId ?? payment?.metadata?.userId;
    const userId = unwrapSerializedString(userIdRaw) || (typeof userIdRaw === "string" ? userIdRaw : "");
    let userEmail = "";

    if (userId) {
      try {
        const user = await User.findById(userId).select("email");
        if (user?.email) {
          userEmail = String(user.email).trim();
        }
      } catch (dbError) {
        console.error("Error fetching user email:", dbError);
      }
    }

    const metadataEmailRaw = metadata?.buyerEmail ?? payment?.metadata?.buyerEmail;
    const metadataEmail = unwrapSerializedString(metadataEmailRaw) || (typeof metadataEmailRaw === "string" ? metadataEmailRaw.trim() : "");
    const additionalInfoEmail =
      unwrapSerializedString(payment?.additional_info?.payer?.email) ||
      (typeof payment?.additional_info?.payer?.email === "string"
        ? payment.additional_info.payer.email.trim()
        : "");
    const payerRecordEmail = unwrapSerializedString(payment?.payer?.email) ||
      unwrapSerializedString(payment?.payer?.payer_email) ||
      payment?.payer?.email ||
      payment?.payer?.payer_email ||
      "";
    const payerEmail = userEmail || metadataEmail || additionalInfoEmail || payerRecordEmail || "";

    const teamEmail = process.env.SMTP_JP;
    if (!payerEmail && !teamEmail) return;

    const currencyId = payment?.currency_id || "CLP";
    const orderItems = parseItemsFromMetadata(metadata);
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

    const buyerNameRaw = metadata?.buyerName ?? payment?.metadata?.buyerName;
    const buyerName =
      unwrapSerializedString(buyerNameRaw) ||
      payment?.payer?.name ||
      "";

    const html = buildEmailHtml(buyerName, itemsHtml, totalAmount, currencyId);

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
