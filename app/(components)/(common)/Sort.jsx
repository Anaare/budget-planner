import { FaSortAlphaUp } from "react-icons/fa";

function Sort({ sortBy, sortOrder, handleSortChange }) {
  return (
    <div className="sort-control flex items-center gap-2 justify-center sm:justify-start">
      <label
        htmlFor="sort-by"
        className="text-gray-700 font-medium whitespace-nowrap"
      >
        <FaSortAlphaUp className="text-3xl" />
      </label>
      <select
        id="sort-by"
        value={`${sortBy}-${sortOrder}`}
        onChange={handleSortChange}
        className="py-2 px-4 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="amount-desc">Amount (High to Low)</option>
        <option value="amount-asc">Amount (Low to High)</option>
        <option value="category-asc">Category (A-Z)</option>
        <option value="category-desc">Category (Z-A)</option>
        <option value="type-asc">Type (A-Z)</option>
        <option value="type-desc">Type (Z-A)</option>
      </select>
    </div>
  );
}

export default Sort;
