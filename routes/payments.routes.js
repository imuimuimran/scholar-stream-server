const router = require("express").Router();
const stripe = require("../config/stripe");
const { createPaymentIntent } = require("../controllers/payment.controller");
const verifyJWT = require("../middlewares/verifyJWT");

/*
  POST /api/payments/create-payment-intent
*/
router.post("/create-payment-intent", verifyJWT, createPaymentIntent);

/*
  Stripe Checkout Session (optional)
*/
router.post("/create-checkout-session", verifyJWT, async (req, res) => {
  try {
    const { amount, courseId, courseTitle } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle || "Payment",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
