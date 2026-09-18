export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { mpPayment } from "@/lib/mercadopago";
import {
  cancelOrderAndRestoreStock,
  confirmOrderPayment,
} from "@/lib/actions/order.actions";

/**
 * Verifica la firma HMAC que Mercado Pago envía en el header `x-signature`.
 * Ver: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
function isSignatureValid(request: NextRequest, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts: Record<string, string> = {};
  for (const pair of signatureHeader.split(",")) {
    const [key, value] = pair.split("=");
    if (key && value) parts[key.trim()] = value.trim();
  }

  const { ts, v1: hash } = parts;
  if (!ts || !hash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const hashBuf = Buffer.from(hash, "hex");

  return (
    expectedBuf.length === hashBuf.length &&
    crypto.timingSafeEqual(expectedBuf, hashBuf)
  );
}

async function handleNotification(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") ?? searchParams.get("topic");
  const dataId = searchParams.get("data.id") ?? searchParams.get("id");

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    // notificación sin body (formato legacy por query params)
  }

  const paymentId = dataId ?? body?.data?.id;
  const notificationType = type ?? body?.type;

  if (!paymentId || notificationType !== "payment") {
    return NextResponse.json({ received: true });
  }

  if (!isSignatureValid(request, String(paymentId))) {
    console.warn("Firma inválida en webhook de Mercado Pago");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payment = await mpPayment.get({ id: String(paymentId) });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    switch (payment.status) {
      case "approved":
        await confirmOrderPayment(orderId, String(payment.id));
        break;
      case "rejected":
        await cancelOrderAndRestoreStock(orderId, "rejected");
        break;
      case "cancelled":
        await cancelOrderAndRestoreStock(orderId, "cancelled");
        break;
      case "refunded":
      case "charged_back":
        await cancelOrderAndRestoreStock(orderId, "refunded");
        break;
      default:
        // in_process / pending / authorized: sin acción hasta la próxima notificación
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleNotification(request);
}

export async function GET(request: NextRequest) {
  return handleNotification(request);
}
