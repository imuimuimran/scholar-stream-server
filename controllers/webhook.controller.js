import stripe from "../config/stripe.js";
import Application from "../models/Application.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {

      const paymentIntent = event.data.object;

      const existing = await Application.findOne({
        transactionId: paymentIntent.id,
      });

      if (existing) {
        return res.json({ received: true });
      }

      await Application.findByIdAndUpdate(
        paymentIntent.metadata.applicationId,
        {
          paymentStatus: "paid",
          transactionId: paymentIntent.id,
        }
      );
    }

    res.json({ received: true });

  } catch (error) {

    console.error("Webhook Error:", error.message);

    res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }
};