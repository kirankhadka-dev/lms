import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);

  const [isEducator, setIsEducator] = useState(true);

  const [enrolledCourses, setEnrolledCourses] = useState([]);

  //Fetch all  courses:

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Function to calculate the average rating of course:
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => (totalRating += rating.rating));
    const averageRating = totalRating / course.courseRatings.length;
    return averageRating;
  };

  // Function to calculate course  chapter time:
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate the course Duration :
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate the No of lectures in the course :
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch  user  enrolled courses :

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  const value = {
    currency: currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    fetchUserEnrolledCourses,
    enrolledCourses,
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
