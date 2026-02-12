import express from "express";
import stripe from "../config/stripe.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

/**
 * POST /api/payments/create-checkout-session
 */
router.post("/create-checkout-session", verifyJWT, async (req, res) => {
  try {
    const { amount, courseId, courseTitle } = req.body;

    if (!amount || !courseId) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle || "Course Purchase",
            },
            unit_amount: amount * 100, // cents
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        courseId,
        userId: req.user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment session failed" });
  }
});

export default router;
