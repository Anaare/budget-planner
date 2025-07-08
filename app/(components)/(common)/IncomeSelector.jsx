// IncomeSelector.jsx
function IncomeSelector({ onChange, value }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
      <label htmlFor="income-input" className="text-lg font-semibold">
        Input your income for current month:
      </label>
      <input
        type="number"
        id="income-input"
        className="
          border-slate-900 border-2 rounded
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          w-full             {/* Make input full width */}
          p-2                {/* Consistent padding */}
          h-10               {/* Consistent height */}
          pl-1               {/* You had pl-1, removed as p-2 includes it */}
          text-gray-900
        "
        value={value}
        onChange={onChange}
        min="0"
      />
    </div>
  );
}

export default IncomeSelector;
