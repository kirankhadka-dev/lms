import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AppContext } from "../../context/AppContext";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);
  console.log(allCourses);

  return (
    <div className="py-16 md:px-40  px-8">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the best{" "}
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Discover our top rated courses across various categories. From coding
        <br />
        and design to business and wellness , our courses are crafted to deliver
        results
      </p>

      {/*  COURSE CARD  */}
      {/* Display 4 courses data  */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  px-4 md:px-0 md:py-16 my-10 gap-4 transition-all duration-100ms ">
        {allCourses?.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link
        className="text-gray-500 border border-gray-500/300 px-10 py-3 rounded inline-block mt-2 "
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CourseSection;
