import stripe from "../config/stripe.js";
import { ObjectId } from "mongodb";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    /* ================= PAYMENT SUCCESS ================= */
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const metadata = paymentIntent.metadata;

      const db = req.db.collection("applications");

      // prevent duplicate entry
      const existing = await db.findOne({
        paymentIntentId: paymentIntent.id,
      });

      if (existing) {
        console.log("Duplicate payment ignored");
        return res.json({ received: true });
      }


       /* ================= CREATE APPLICATION ================= */
      const application = {
        scholarshipId: metadata.scholarshipId,
        scholarshipName: metadata.scholarshipName,
        universityName: metadata.universityName,

        userEmail: metadata.userEmail,

        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,

        paymentStatus: "paid",
        status: "pending",
        feedback: "",

        createdAt: new Date(),
      };

      await db.insertOne(application);

      console.log("Application saved via webhook");
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};