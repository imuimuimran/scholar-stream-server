import stripe from "../config/stripe.js";

import Scholarship from "../models/Scholarship.js";

export const createPaymentIntent = async (
  req,
  res
) => {
  try {

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        payment_method_types: ["card"],
      });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {

    console.error(
      "PAYMENT INTENT ERROR:",
      error.message
    );

    res.status(500).json({
      message: error.message,
    });
  }
};