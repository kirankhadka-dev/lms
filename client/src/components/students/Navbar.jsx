import React, { useContext } from "react";
import { assets } from "../../assets/assets.js";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.jsx";

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  // On Clicking the Sign in Button, it will open the Clerk Sign in Modal
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { navigate, isEducator, setIsEducator } = useContext(AppContext);

  return (
    <div
      className={`flex  items-center justify-between px-4 sm:px-10 md:px-14 lg:px-24 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="LogoImage"
        className="w-28 lg:w-32 cursor-pointer "
      />

      {/* DESKTOP VIEW  */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button
                onClick={() => {
                  navigate("/educator");
                }}
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              | <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white   !px-5 !py-2 rounded-full hover:bg-blue-700"
          >
            Create Account
          </button>
        )}
      </div>

      {/* MOBILE VIEW : PHONE SECREEN */}

      <div className="md:hidden flex items-center gap-2 sm:gap-5  text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2  max-sm:text-xs">
          {user && (
            <>
              <button
                onClick={() => {
                  navigate("/educator");
                }}
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              | <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="userIcon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
