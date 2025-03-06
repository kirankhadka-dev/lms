import express from "express";
import {
  purchaseCourse,
  userDetails,
  userEnrolledCourses,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/data").get(userDetails);
userRouter.route("/enrolled-courses").get(userEnrolledCourses);
userRouter.route("/purchase").post(purchaseCourse);

export default userRouter;
