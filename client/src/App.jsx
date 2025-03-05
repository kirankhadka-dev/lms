import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
// Student Pages
import Home from "./pages/students/Home";
import CoursesList from "./pages/students/CoursesList";
import CourseDetail from "./pages/students/CourseDetail";
import MyEnrollments from "./pages/students/MyEnrollments";
import Player from "./pages/students/Player";
import Loading from "./components/students/Loading";

// Educator Pages
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentEnrolled from "./pages/educator/StudentEnrolled";

// Student Components
import Navbar from "./components/students/Navbar";

// Quil Import

import "quill/dist/quill.snow.css";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  console.log("isEducatorRoute ", isEducatorRoute);

  return (
    <div className="text-default min-h-screen bg-white">
      {!isEducatorRoute && <Navbar />}{" "}
      {/* Render Navbar only if not on Educator route */}
      <Routes>
        {/* Student Routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator Routes  */}
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
