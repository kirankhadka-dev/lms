import express from "express";
import { AllCourse, course } from "../controllers/course.controller.js";
const courseRouter = express.Router();

courseRouter.route("/all").get(AllCourse);
courseRouter.route("/:id").get(course);

export default courseRouter;
