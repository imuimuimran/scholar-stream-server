import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  throw new Error("STRIPE_SECRET_KEY missing. Check .env loading.");
}

const stripe = new Stripe(key);

export default stripe;