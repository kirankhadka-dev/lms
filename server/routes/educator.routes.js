import express from "express";

import {
  addCourse,
  educatorCourses,
  educatorDashboard,
  enrolledStudentsWithPurchase,
  updateRoleToEducator,
} from "../controllers/educator.controller.js";
import upload from "../configs/multer.js";
import protectEducator from "../middlewares/auth.middleware.js";

const educatorRouter = express.Router();

// Add educator role
educatorRouter.route("/update-role").get(updateRoleToEducator);
educatorRouter
  .route("/add-course")
  .post(upload.single("image"), protectEducator, addCourse);

educatorRouter.route("/courses").get(protectEducator, educatorCourses);
educatorRouter.route("/dashboard").get(protectEducator, educatorDashboard);
educatorRouter
  .route("/enrolled-students")
  .get(protectEducator, enrolledStudentsWithPurchase);

export default educatorRouter;
