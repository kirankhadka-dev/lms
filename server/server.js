import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import {
  clerkWebHooks,
  stripeWebHooks,
} from "./controllers/webhooks.controller.js";
import educatorRouter from "./routes/educator.routes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/coudinary.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";

// Initialize Express

const app = express();

// connect to the database

await connectDB();

// Cloudinary
await connectCloudinary();

// Middlewares

app.use(cors());
// Add auth to the every request
app.use(clerkMiddleware());

//Routes

app.get("/", (req, res) => {
  return res.send("API is working ");
});

app.post("/clerk", express.json(), clerkWebHooks);

// educator routes

app.use("/api/v1/educator", express.json(), educatorRouter);

// course routes
app.use("/api/v1/course", express.json(), courseRouter);

// user routes :

app.use("/api/v1/user", express.json(), userRouter);

// stripe webhooks :

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
});
