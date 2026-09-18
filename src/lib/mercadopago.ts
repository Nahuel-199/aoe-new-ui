import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Missing environment variable: "MERCADOPAGO_ACCESS_TOKEN"');
}

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mpPreference = new Preference(mercadopago);
export const mpPayment = new Payment(mercadopago);

export default mercadopago;
