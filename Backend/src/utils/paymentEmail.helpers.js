const formatCurrency = (value, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(Number(value || 0));

const unwrapSerializedString = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") {
    if (value.$oid) {
      return String(value.$oid).trim();
    }
    if (value.value) {
      return unwrapSerializedString(value.value);
    }
    if (Array.isArray(value)) {
      return value.length ? unwrapSerializedString(value[0]) : "";
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

const parseExternalReference = (value) => {
  if (!value || typeof value !== "string") return {};
  const trimmed = value.trim();
  if (!trimmed) return {};

  const tryParseJson = (input) => {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  };

  const parsedDirect = tryParseJson(trimmed);
  if (parsedDirect && typeof parsedDirect === "object") {
    return parsedDirect;
  }

  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf8");
    const parsedDecoded = tryParseJson(decoded);
    if (parsedDecoded && typeof parsedDecoded === "object") {
      return parsedDecoded;
    }
  } catch {
    /* noop */
  }

  return {};
};

const normalizeItems = (items) => {
  if (!Array.isArray(items) || !items.length) return [];
  return items
    .map((item) => {
      if (item && typeof item === "object") {
        const quantity = Number(item.quantity || item.qty || 1);
        const unitPrice =
          Number(item.unit_price ?? item.unitPrice ?? item.price ?? item.unitPriceAmount ?? 0);
        const title =
          item.title ||
          item.name ||
          item.description ||
          "";
        if (!title) return null;
        return {
          title: String(title),
          quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
          unit_price: Number.isFinite(unitPrice) ? unitPrice : 0,
        };
      }
      return null;
    })
    .filter(Boolean);
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
    return normalizeItems(Array.isArray(parsed) ? parsed : []);
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
    <title>Pago recibido - Astroman��a</title>
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
      ��Pago recibido! Gracias por tu compra en Astroman��a.
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
                      <div style="color:#ffffff; font:700 18px/1.2 Arial, Helvetica, sans-serif;">Astroman��a</div>
                      <div style="color:#9CA3AF; font:400 12px/1.4 Arial, Helvetica, sans-serif;">Confirmaci��n de pago</div>
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
                  Gracias por tu compra${buyerName ? `, ${buyerName}` : ""}!
                </h2>
                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#374151;">
                  Hemos recibido tu pago correctamente. Aqui tienes el resumen:
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

                <!-- Bot��n CTA -->
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
                  Si necesitas asistencia, escribenos a
                  <a href="mailto:contacto@astromania.cl" style="color:#6B7280; text-decoration:underline;">contacto@astromania.cl</a>.
                </p>

                <p style="margin:24px 0 0 0; font-size:13px; color:#6B7280;">
                  Equipo Astromania
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px 28px 28px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">
                <hr style="border:none; border-top:1px solid #E5E7EB; margin:0 0 12px 0;">
                <p style="margin:0;">Este es un mensaje automatico. Por favor, no respondas a este correo.</p>
                <p style="margin:4px 0 0 0;">�� ${new Date().getFullYear()} Astromania. Todos los derechos reservados.</p>
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

export {
  buildEmailHtml,
  extractMetadata,
  formatCurrency,
  normalizeItems,
  parseExternalReference,
  parseItemsFromMetadata,
  unwrapSerializedString,
};
