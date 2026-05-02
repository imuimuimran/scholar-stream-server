import { ObjectId } from "mongodb";
import stripe from "../config/stripe.js";

// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const createPaymentIntent = async (req, res) => {
  try {
    const { scholarshipId } = req.body;

    const scholarship = await req.db
      .collection("scholarships")
      .findOne({ _id: new ObjectId(scholarshipId) });

    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    const amount = scholarship.applicationFees;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",

       metadata: {
        scholarshipId: scholarshipId,
        scholarshipName: scholarship.scholarshipName,
        universityName: scholarship.universityName,
        userEmail: req.user.email,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};