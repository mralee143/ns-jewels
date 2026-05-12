import nodemailer from "nodemailer";

import { formatOrderNumber } from "@/lib/order-format";
import { formatPkrDetailed } from "@/lib/pricing";

const SMTP_HOST = process.env.SMTP_HOST?.trim() ?? "";
const SMTP_PORT = Number.parseInt(process.env.SMTP_PORT?.trim() ?? "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER?.trim() ?? "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD?.trim() ?? "";
const SMTP_FROM = process.env.SMTP_FROM?.trim() ?? "";
const ADMIN_ORDER_EMAIL =
  process.env.ADMIN_ORDER_EMAIL?.trim() ?? process.env.ADMIN_EMAIL?.trim() ?? "";
const ORDER_EMAIL_CONSOLE_FALLBACK =
  process.env.NODE_ENV !== "production" || process.env.ORDER_EMAIL_CONSOLE_FALLBACK === "true";

type OrderEmailItem = {
  readonly productTitle: string;
  readonly quantity: number;
  readonly unitPricePaisa: number;
};

type OrderEmailOrder = {
  readonly addressLine1: string | null;
  readonly city: string | null;
  readonly country: string;
  readonly customerName: string | null;
  readonly deliveryPaisa: number;
  readonly email: string | null;
  readonly id: string;
  readonly items: readonly OrderEmailItem[];
  readonly paymentMethod: string;
  readonly phone: string | null;
  readonly postalCode: string | null;
  readonly subtotalPaisa: number;
  readonly taxPaisa: number;
  readonly totalPaisa: number;
};

type TransactionalEmail = {
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly to: string;
};

type CustomerOrderEmailContent = {
  readonly body: string;
  readonly eyebrow: string;
  readonly headline: string;
};

const hostLikelyRequiresAuth = (host: string): boolean => {
  const normalizedHost = host.toLowerCase();
  return ["gmail", "google", "outlook", "office365", "live.com", "yahoo", "zoho"].some((provider) =>
    normalizedHost.includes(provider),
  );
};

const formatAddress = (order: OrderEmailOrder): string =>
  [order.addressLine1, order.city, order.postalCode, order.country].filter(Boolean).join(", ") || "Address not set";

const formatOrderItems = (items: readonly OrderEmailItem[]): string =>
  items
    .map(
      (item) =>
        `- ${item.productTitle} x${item.quantity}: ${formatPkrDetailed(item.unitPricePaisa * item.quantity)}`,
    )
    .join("\n");

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildOrderSummary = (order: OrderEmailOrder): string =>
  [
    `Order: ${formatOrderNumber(order.id)}`,
    `Customer: ${order.customerName ?? "Guest checkout"}`,
    `Email: ${order.email ?? "No email provided"}`,
    `Phone: ${order.phone ?? "No phone provided"}`,
    `Address: ${formatAddress(order)}`,
    `Payment: ${order.paymentMethod.toUpperCase()}`,
    "",
    "Items:",
    formatOrderItems(order.items),
    "",
    `Subtotal: ${formatPkrDetailed(order.subtotalPaisa)}`,
    `Shipping: ${formatPkrDetailed(order.deliveryPaisa)}`,
    `Tax: ${formatPkrDetailed(order.taxPaisa)}`,
    `Total: ${formatPkrDetailed(order.totalPaisa)}`,
  ].join("\n");

const buildOrderRowsHtml = (order: OrderEmailOrder): string =>
  order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #F0D3DA;">
            <div style="font-weight: 700; color: #2B2B2B;">${escapeHtml(item.productTitle)}</div>
            <div style="margin-top: 4px; font-size: 13px; color: #6E6E6E;">Quantity ${item.quantity}</div>
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid #F0D3DA; text-align: right; font-weight: 700; color: #2B2B2B;">
            ${escapeHtml(formatPkrDetailed(item.unitPricePaisa * item.quantity))}
          </td>
        </tr>`,
    )
    .join("");

const buildCustomerOrderEmailHtml = (order: OrderEmailOrder, content: CustomerOrderEmailContent): string => {
  const orderNumber = formatOrderNumber(order.id);
  const customerName = order.customerName ? escapeHtml(order.customerName) : "there";

  return `<!doctype html>
<html>
  <body style="margin: 0; background: #FDF2F5; font-family: Arial, Helvetica, sans-serif; color: #2B2B2B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #FDF2F5; padding: 28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; overflow: hidden; border: 1px solid #F0D3DA; border-radius: 28px; background: #FFFFFF; box-shadow: 0 18px 45px rgba(216, 92, 108, 0.12);">
            <tr>
              <td style="padding: 30px 28px 24px; background: linear-gradient(135deg, #E96A7A, #F6C1CC); color: #FFFFFF;">
                <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase;">NS Jewels</div>
                <h1 style="margin: 16px 0 0; font-size: 30px; line-height: 1.15; font-weight: 700;">${escapeHtml(content.headline)}</h1>
                <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.7;">Hi ${customerName}, ${escapeHtml(content.body)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 26px 28px;">
                <div style="display: inline-block; margin-bottom: 18px; border-radius: 999px; background: #FDF2F5; padding: 9px 14px; color: #D85C6C; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">
                  ${escapeHtml(content.eyebrow)}
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 22px; border: 1px solid #F0D3DA; border-radius: 20px; background: #FDF2F5;">
                  <tr>
                    <td style="padding: 18px;">
                      <div style="font-size: 12px; color: #6E6E6E; text-transform: uppercase; letter-spacing: 0.16em;">Order number</div>
                      <div style="margin-top: 6px; font-family: 'Courier New', monospace; font-size: 22px; font-weight: 700; color: #2B2B2B;">${escapeHtml(orderNumber)}</div>
                    </td>
                    <td style="padding: 18px; text-align: right;">
                      <div style="font-size: 12px; color: #6E6E6E; text-transform: uppercase; letter-spacing: 0.16em;">Total</div>
                      <div style="margin-top: 6px; font-size: 22px; font-weight: 800; color: #2B2B2B;">${escapeHtml(formatPkrDetailed(order.totalPaisa))}</div>
                    </td>
                  </tr>
                </table>

                <h2 style="margin: 0 0 8px; font-size: 18px; color: #2B2B2B;">Order details</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  ${buildOrderRowsHtml(order)}
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 18px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #6E6E6E;">Subtotal</td>
                    <td style="padding: 6px 0; text-align: right; color: #2B2B2B;">${escapeHtml(formatPkrDetailed(order.subtotalPaisa))}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6E6E6E;">Shipping</td>
                    <td style="padding: 6px 0; text-align: right; color: #2B2B2B;">${escapeHtml(formatPkrDetailed(order.deliveryPaisa))}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6E6E6E;">Tax</td>
                    <td style="padding: 6px 0; text-align: right; color: #2B2B2B;">${escapeHtml(formatPkrDetailed(order.taxPaisa))}</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 0 0; border-top: 1px solid #F0D3DA; font-size: 18px; font-weight: 800;">Total</td>
                    <td style="padding: 14px 0 0; border-top: 1px solid #F0D3DA; text-align: right; font-size: 20px; font-weight: 800; color: #D85C6C;">${escapeHtml(formatPkrDetailed(order.totalPaisa))}</td>
                  </tr>
                </table>

                <div style="margin-top: 24px; border-radius: 20px; background: #FDF2F5; padding: 18px;">
                  <div style="font-size: 12px; color: #6E6E6E; text-transform: uppercase; letter-spacing: 0.16em;">Delivery address</div>
                  <div style="margin-top: 8px; line-height: 1.6; color: #2B2B2B;">${escapeHtml(formatAddress(order))}</div>
                  <div style="margin-top: 10px; color: #6E6E6E;">Payment: ${escapeHtml(order.paymentMethod.toUpperCase())}</div>
                </div>

                <p style="margin: 24px 0 0; color: #6E6E6E; font-size: 13px; line-height: 1.7;">
                  Thank you for shopping with NS Jewels. We will contact you if we need any more details.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildAdminOrderEmailHtml = (order: OrderEmailOrder): string => {
  const orderNumber = formatOrderNumber(order.id);

  return `<!doctype html>
<html>
  <body style="margin: 0; background: #FDF2F5; font-family: Arial, Helvetica, sans-serif; color: #2B2B2B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #FDF2F5; padding: 28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; border: 1px solid #F0D3DA; border-radius: 24px; background: #FFFFFF;">
            <tr>
              <td style="padding: 26px; border-bottom: 1px solid #F0D3DA;">
                <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.22em; color: #D85C6C; text-transform: uppercase;">New NS Jewels order</div>
                <h1 style="margin: 10px 0 0; font-size: 26px;">${escapeHtml(orderNumber)}</h1>
                <p style="margin: 10px 0 0; color: #6E6E6E;">${escapeHtml(order.customerName ?? "Guest checkout")} · ${escapeHtml(order.email ?? "No email")} · ${escapeHtml(formatPkrDetailed(order.totalPaisa))}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 26px;">
                <pre style="white-space: pre-wrap; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.7; color: #2B2B2B;">${escapeHtml(buildOrderSummary(order))}</pre>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendTransactionalEmail = async ({ html, subject, text, to }: TransactionalEmail): Promise<void> => {
  const missingBasics = !SMTP_HOST || !SMTP_FROM;
  const missingAuthForHostedProvider =
    !missingBasics && hostLikelyRequiresAuth(SMTP_HOST) && (!SMTP_USER || !SMTP_PASSWORD);

  const logEmailToConsole = (reason: string): void => {
    console.warn(`[order email] ${reason}`);
    console.info(`[order email] To ${to}: ${subject}\n${text}`);
  };

  if (missingBasics) {
    if (ORDER_EMAIL_CONSOLE_FALLBACK) {
      logEmailToConsole("SMTP_HOST or SMTP_FROM is unset; printing email to the server console.");
      return;
    }
    throw new Error("SMTP_HOST and SMTP_FROM are required to send order emails.");
  }

  if (missingAuthForHostedProvider) {
    if (ORDER_EMAIL_CONSOLE_FALLBACK) {
      logEmailToConsole("SMTP_USER or SMTP_PASSWORD is missing for this SMTP host; printing email to console.");
      return;
    }
    throw new Error("SMTP_USER and SMTP_PASSWORD are required for this SMTP provider.");
  }

  const transporter = nodemailer.createTransport({
    auth:
      SMTP_USER && SMTP_PASSWORD
        ? {
            pass: SMTP_PASSWORD,
            user: SMTP_USER,
          }
        : undefined,
    host: SMTP_HOST,
    port: SMTP_PORT,
    requireTLS: !SMTP_SECURE && SMTP_PORT === 587,
    secure: SMTP_SECURE,
  });

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      html,
      subject,
      text,
      to,
    });
    console.info(`[order email] SMTP accepted ${subject} for ${to}. messageId=${String(info.messageId ?? "")}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (ORDER_EMAIL_CONSOLE_FALLBACK) {
      logEmailToConsole(`Email send failed (${message}); printing email to console.`);
      return;
    }
    throw error instanceof Error ? error : new Error(message);
  }
};

export const sendOrderPlacedEmails = async (order: OrderEmailOrder): Promise<void> => {
  const orderNumber = formatOrderNumber(order.id);
  const summary = buildOrderSummary(order);
  const customerEmail = order.email?.trim();

  const customerMessage = customerEmail
    ? sendTransactionalEmail({
        html: buildCustomerOrderEmailHtml(order, {
          body: "we received your order and our team will review it shortly.",
          eyebrow: "Order received",
          headline: "We received your order",
        }),
        subject: `Your NS Jewels order ${orderNumber} was received`,
        text: [
          `Thank you${order.customerName ? `, ${order.customerName}` : ""}.`,
          "",
          "We received your order and will contact you if anything else is needed.",
          "",
          summary,
        ].join("\n"),
        to: customerEmail,
      })
    : Promise.resolve();

  const adminMessage = ADMIN_ORDER_EMAIL
    ? sendTransactionalEmail({
        html: buildAdminOrderEmailHtml(order),
        subject: `New NS Jewels order ${orderNumber}`,
        text: ["A new order was placed.", "", summary].join("\n"),
        to: ADMIN_ORDER_EMAIL,
      })
    : Promise.resolve(console.warn("[order email] ADMIN_ORDER_EMAIL is unset; admin order email skipped."));

  await Promise.all([customerMessage, adminMessage]);
};

export const sendOrderConfirmedEmail = async (order: OrderEmailOrder): Promise<void> => {
  const customerEmail = order.email?.trim();
  if (!customerEmail) {
    console.warn(`[order email] Order ${order.id} has no customer email; confirmed email skipped.`);
    return;
  }

  const orderNumber = formatOrderNumber(order.id);
  await sendTransactionalEmail({
    html: buildCustomerOrderEmailHtml(order, {
      body: "your order has been confirmed by our team. We are preparing it now.",
      eyebrow: "Order confirmed",
      headline: "Your order is confirmed",
    }),
    subject: `Your NS Jewels order ${orderNumber} is confirmed`,
    text: [
      `Thank you${order.customerName ? `, ${order.customerName}` : ""}.`,
      "",
      `Your order ${orderNumber} has been confirmed by our team.`,
      "",
      buildOrderSummary(order),
    ].join("\n"),
    to: customerEmail,
  });
};

export const sendOrderShippedEmail = async (order: OrderEmailOrder): Promise<void> => {
  const customerEmail = order.email?.trim();
  if (!customerEmail) {
    console.warn(`[order email] Order ${order.id} has no customer email; shipped email skipped.`);
    return;
  }

  const orderNumber = formatOrderNumber(order.id);
  await sendTransactionalEmail({
    html: buildCustomerOrderEmailHtml(order, {
      body: "good news, your order has been marked as shipped.",
      eyebrow: "Order shipped",
      headline: "Your order has shipped",
    }),
    subject: `Your NS Jewels order ${orderNumber} has shipped`,
    text: [
      `Good news${order.customerName ? `, ${order.customerName}` : ""}.`,
      "",
      `Your order ${orderNumber} has been marked as shipped.`,
      "Thank you for shopping with NS Jewels.",
      "",
      buildOrderSummary(order),
    ].join("\n"),
    to: customerEmail,
  });
};
