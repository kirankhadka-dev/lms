import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    lectureId: {
      type: String,
      required: true,
    },
    lectureTitle: {
      type: String,
      required: true,
    },

    lectureDuration: {
      type: Number,
      required: true,
    },

    lectureUrl: {
      type: String,
      required: true,
    },

    isPreviewFree: {
      type: Boolean,
      required: true,
    },
    lectureOrder: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const chapterSchema = new Schema(
  {
    chapterId: {
      type: String,
      required: true,
    },

    chapterOrder: {
      type: Number,
      requird: true,
    },
    chapterTitle: {
      type: String,
      required: true,
    },

    chapterContent: [lectureSchema],
  },
  { _id: false }
);

const courseSchema = new Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    },

    courseDescription: {
      type: String,
      required: true,
    },

    courseThumbnail: {
      type: String,
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    courseContent: [chapterSchema],
    courseRatings: [
      {
        userId: {
          type: String,
        },

        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],

    educator: {
      type: String,
      ref: "User",
    },

    enrolledStudents: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
