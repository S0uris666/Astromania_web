import { sendPurchaseConfirmationMail } from "../services/mailer.service.js";
import User from "../models/User.model.js";
import PaymentEmailLog from "../models/PaymentEmailLog.model.js";
import {
  buildEmailHtml,
  extractMetadata,
  formatCurrency,
  parseExternalReference,
  parseItemsFromMetadata,
  unwrapSerializedString,
} from "./paymentEmail.helpers.js";

export const sendConfirmationEmailIfNeeded = async (payment) => {
  try {
    if (!payment?.id) return;
    if (payment.status !== "approved") return;

    const paymentIdString = String(payment.id);

    if (process.env.NODE_ENV !== "production") {
      console.log("[payments] raw payment metadata", payment?.metadata);
      console.log("[payments] raw payment additional_info", payment?.additional_info);
    }

    const metadata = extractMetadata(payment);
    const externalRef = parseExternalReference(payment?.external_reference);

    const userIdRaw =
      metadata?.userId ??
      externalRef?.userId ??
      payment?.metadata?.userId;
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
    const externalEmailRaw = externalRef?.buyerEmail || externalRef?.userEmail;
    const metadataEmail = unwrapSerializedString(metadataEmailRaw) || (typeof metadataEmailRaw === "string" ? metadataEmailRaw.trim() : "");
    const externalEmail = unwrapSerializedString(externalEmailRaw) || (typeof externalEmailRaw === "string" ? externalEmailRaw.trim() : "");
    const additionalInfoEmail =
      unwrapSerializedString(payment?.additional_info?.payer?.email) ||
      (typeof payment?.additional_info?.payer?.email === "string"
        ? payment.additional_info.payer.email.trim()
        : "");
    const payerRecordEmail =
      unwrapSerializedString(payment?.payer?.email) ||
      unwrapSerializedString(payment?.payer?.payer_email) ||
      payment?.payer?.email ||
      payment?.payer?.payer_email ||
      "";
    const payerEmail = userEmail || metadataEmail || externalEmail || additionalInfoEmail || payerRecordEmail || "";

    if (!payerEmail) {
      console.warn("[payments] No se pudo resolver email del comprador", {
        paymentId: payment.id,
        userId,
        metadataEmail,
        externalEmail,
        additionalInfoEmail,
        payerRecordEmail,
        metadata: metadata ? Object.keys(metadata) : null,
        externalRef,
      });
    } else if (process.env.NODE_ENV !== "production") {
      console.log("[payments] Email del comprador resuelto", {
        paymentId: payment.id,
        resolvedEmail: payerEmail,
        userId,
        userEmail,
        metadataEmail,
        externalEmail,
        additionalInfoEmail,
        payerRecordEmail,
        externalRef,
      });
    }

    const now = new Date();
    let logEntry;
    try {
      logEntry = await PaymentEmailLog.findOneAndUpdate(
        {
          paymentId: paymentIdString,
          status: { $nin: ["sending", "sent"] },
        },
        {
          $setOnInsert: {
            paymentId: paymentIdString,
            createdAt: now,
          },
          $set: {
            email: payerEmail || process.env.SMTP_JP || "",
            userId: userId || null,
            status: "sending",
            updatedAt: now,
            errorMessage: null,
          },
          $inc: { attempts: 1 },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    } catch (dbError) {
      if (dbError?.code === 11000) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[payments] Email ya en curso (duplicate key). Omitiendo envio.", {
            paymentId: paymentIdString,
          });
        }
        return;
      }
      throw dbError;
    }

    if (!logEntry) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[payments] Email ya gestionado, omitiendo reenvio", {
          paymentId: paymentIdString,
          prevStatus: "unknown",
        });
      }
      return;
    }

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
      : "<li>Tu compra se registro correctamente.</li>";

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

    try {
      await sendPurchaseConfirmationMail({
        to: payerEmail || teamEmail,
        subject: "Confirmacion de compra | Astromania",
        html,
        bcc: payerEmail && teamEmail && payerEmail !== teamEmail ? teamEmail : undefined,
      });

      await PaymentEmailLog.updateOne(
        { paymentId: paymentIdString },
        {
          $set: {
            status: "sent",
            sentAt: new Date(),
            email: payerEmail || teamEmail,
            userId: userId || null,
          },
        },
      );
    } catch (mailError) {
      await PaymentEmailLog.updateOne(
        { paymentId: paymentIdString },
        {
          $set: {
            status: "failed",
            errorMessage: mailError?.message || String(mailError),
            updatedAt: new Date(),
          },
        },
      );
      throw mailError;
    }
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error);
  }
};
