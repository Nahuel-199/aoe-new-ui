"use server";

import { mpPreference, mpPayment } from "@/lib/mercadopago";
import {
  attachPaymentPreference,
  cancelOrderAndRestoreStock,
  confirmOrderPayment,
  getOrderRaw,
} from "./order.actions";

function getBaseUrl() {
  // MERCADOPAGO_BASE_URL permite testear webhooks con un túnel (ngrok) sin
  // pisar AUTH_URL — si lo hiciéramos, el redirect_uri de Google OAuth dejaría
  // de matchear con lo registrado en Google Console y rompería el login.
  const url =
    process.env.MERCADOPAGO_BASE_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  if (!url) throw new Error('Missing environment variable: "AUTH_URL"');
  return url.replace(/\/$/, "");
}

/**
 * Crea una preferencia de pago de Mercado Pago (Checkout Pro) para una orden
 * ya existente y devuelve la URL a la que hay que redirigir al comprador.
 */
export async function createPaymentPreference(orderId: string): Promise<
  | { success: true; initPoint: string }
  | { success: false; message: string }
> {
  try {
    const order = await getOrderRaw(orderId);
    if (!order) {
      return { success: false, message: "Orden no encontrada" };
    }

    const baseUrl = getBaseUrl();

    const preferenceItems = order.items.map((item: any) => ({
      id: item.productId,
      title: `${item.productName} (${item.variant.color} - ${item.variant.size})`,
      quantity: item.variant.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: "ARS",
    }));

    if (order.deliveryCost > 0) {
      preferenceItems.push({
        id: "envio",
        title: "Envío a domicilio",
        quantity: 1,
        unit_price: Number(order.deliveryCost),
        currency_id: "ARS",
      });
    }

    const preference = await mpPreference.create({
      body: {
        items: preferenceItems,
        external_reference: orderId,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        back_urls: {
          success: `${baseUrl}/checkout/success?orderId=${orderId}`,
          pending: `${baseUrl}/checkout/pending?orderId=${orderId}`,
          failure: `${baseUrl}/checkout/failure?orderId=${orderId}`,
        },
        auto_return: "approved",
        statement_descriptor: "AOE INDUMENTARIA",
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Mercado Pago no devolvió una preferencia válida");
    }

    await attachPaymentPreference(orderId, preference.id);

    return { success: true, initPoint: preference.init_point };
  } catch (error) {
    console.error("Error creando preferencia de Mercado Pago:", error);

    await cancelOrderAndRestoreStock(orderId, "cancelled").catch((err) =>
      console.error("Error revirtiendo orden tras falla de MP:", err)
    );

    return {
      success: false,
      message: "No pudimos iniciar el pago. Por favor, intentá nuevamente.",
    };
  }
}

/**
 * Confirma el pago consultando directamente la API de Mercado Pago.
 *
 * El webhook es la vía normal para marcar una orden como pagada, pero en modo
 * de pruebas a veces se demora o no llega. Esta función se llama también al
 * volver a `/checkout/success` para no depender exclusivamente del webhook;
 * es idempotente (confirmOrderPayment sólo actualiza órdenes que no estén
 * "approved" todavía).
 */
export async function verifyAndConfirmPayment(
  orderId: string,
  paymentId?: string | null
) {
  const order = await getOrderRaw(orderId);
  if (!order) return { status: "not_found" as const };
  if (order.paymentStatus === "approved") return { status: "approved" as const };
  if (!paymentId) return { status: order.paymentStatus };

  try {
    const payment = await mpPayment.get({ id: paymentId });
    if (payment.external_reference !== orderId) {
      return { status: order.paymentStatus };
    }

    switch (payment.status) {
      case "approved":
        await confirmOrderPayment(orderId, String(payment.id));
        return { status: "approved" as const };
      case "rejected":
        await cancelOrderAndRestoreStock(orderId, "rejected");
        return { status: "rejected" as const };
      case "cancelled":
        await cancelOrderAndRestoreStock(orderId, "cancelled");
        return { status: "cancelled" as const };
      default:
        return { status: payment.status };
    }
  } catch (error) {
    console.error("Error verificando pago de Mercado Pago:", error);
    return { status: "error" as const };
  }
}
