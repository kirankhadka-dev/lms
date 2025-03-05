import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + searchInput);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
    >
      <img
        src={assets.search_icon}
        alt="search Icon "
        className="md:w-auto w-10 px-3 "
      />
      <input
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        type="text"
        placeholder="Search for the courses "
        className="!w-full !h-full outline-none text-gray-500/80"
      />

      <button
        className="bg-blue-600 rounded text-white md:px-10 px-7  inline-block md:py-3 py-2 mx-1"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
