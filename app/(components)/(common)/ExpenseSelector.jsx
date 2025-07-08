// ExpenseSelector.jsx
function ExpenseSelector({ onChange, value }) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <h3 className="text-lg font-semibold col-span-full">
        Select expense by category for current month:
      </h3>
      <div className="flex flex-col gap-4">
        {Object.keys(value).map((category) => {
          return (
            <div key={category} className="flex flex-col">
              <label htmlFor={category} className="text-sm mb-1.5 font-medium">
                Input expense for {category}:
              </label>
              <input
                type="number"
                id={category}
                value={value[category]}
                onChange={(e) => onChange(category, e.target.value)}
                className="
                  border-2 border-slate-900 rounded
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  w-full             {/* Make input full width */}
                  p-2                {/* Consistent padding */}
                  h-10               {/* Consistent height */}
                  text-gray-900
                "
                min="0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseSelector;
