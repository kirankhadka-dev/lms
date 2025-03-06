import { Webhook } from "svix";
import User from "../models/user.model.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.model.js";

//  Function to manage clerk user with the database

export const clerkWebHooks = async (req, res) => {
  try {
    const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await wHook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);

        return res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Signature Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const session = await stripeInstance.checkout.sessions.retrieve(
          paymentIntent.id
        );

        if (!session.metadata || !session.metadata.purchaseId) {
          console.error("Missing metadata in session");
          return res.status(400).send("Missing metadata in session");
        }

        const purchaseId = session.metadata.purchaseId;
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(`Purchase not found: ${purchaseId}`);
          return res.status(404).send("Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        if (userData && courseData) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();

          userData.enrolledCourse.push(courseData._id);
          await userData.save();

          purchaseData.status = "completed";
          await purchaseData.save();
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const session = await stripeInstance.checkout.sessions.retrieve(
          paymentIntent.id
        );

        if (!session.metadata || !session.metadata.purchaseId) {
          console.error("Missing metadata in session");
          return res.status(400).send("Missing metadata in session");
        }

        const purchaseId = session.metadata.purchaseId;
        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = "failed";
          await purchaseData.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Processing Error:", err.message);
    res.status(500).send(`Webhook Processing Error: ${err.message}`);
  }
};
