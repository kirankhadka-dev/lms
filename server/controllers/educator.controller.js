import { clerkClient } from "@clerk/express";
import Course from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/purchase.model.js";

// update role to the educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// add new course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ sucess: false, message: "Thumbnail not attached " });
    }

    const parseCourseData = await JSON.parse(courseData);
    parseCourseData.educator = educatorId;

    const newCourse = await Course.create(parseCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "course added " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get eductaor courses
export const educatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get educator dashboard data (total earning,enrolled students,no of courses )

export const educatorDashboard = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const toalCOurses = courses.length;
    const courseIds = courses.map((course) => course._id);
    //Calculate the total earning from purchases:
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, purchase) => {
      return sum + purchase.amount;
    }, 0);

    //  collect unique enrolled student id with their course title :
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });

      res.json({
        success: true,
        dashboardData: {
          totalEarnings,
          enrolledStudentsData,
          totalCourses,
        },
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get enrolled students data with purchase data

export const enrolledStudentsWithPurchase = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {}
};
