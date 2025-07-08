"use client";
import { FaFilter } from "react-icons/fa6";

function Filter({ activeFilter, onFilterChange, filters }) {
  // const filters = [null, 7, 14, 30];

  const getLabel = (days) => {
    if (days === null) return "All Time";
    return `${days} Days`;
  };

  return (
    <div className="filter-buttons flex flex-wrap gap-2 justify-center sm:justify-start">
      <span className="self-center text-gray-700 font-medium whitespace-nowrap">
        <FaFilter className="text-3xl" />
      </span>
      {filters.map((days) => (
        <button
          key={days ?? "all"}
          className={`py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${
            activeFilter === days
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => onFilterChange(days)}
        >
          {getLabel(days)}
        </button>
      ))}
    </div>
  );
}

export default Filter;
