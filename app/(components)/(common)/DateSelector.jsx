function DateSelector({ month, year, onMonthChange, onYearChange }) {
  return (
    <>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        <label htmlFor="year-select" className="text-lg font-semibold">
          Select A year for your budget:
        </label>
        <input
          name="year"
          id="year-select"
          type="number"
          onChange={onYearChange}
          value={year}
          className="
          border-slate-900 border-2 rounded
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          w-full             
          p-2                
          h-10               
          text-gray-900
        "
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        <label htmlFor="months-select" className="text-lg font-semibold">
          Select A month for your budget:
        </label>
        <select
          name="months"
          id="months-select"
          onChange={onMonthChange}
          value={month}
          className="
          border-slate-900 border-2 rounded
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          w-full             
          p-2               
          h-10               
          text-gray-900
          
        "
        >
          <option value="">-- Select a Month --</option>
          <option value="january">January</option>
          <option value="february">February</option>
          <option value="march">March</option>
          <option value="april">April</option>
          <option value="may">May</option>
          <option value="june">June</option>
          <option value="july">July</option>
          <option value="august">August</option>
          <option value="september">September</option>
          <option value="october">October</option>
          <option value="november">November</option>
          <option value="december">December</option>
        </select>
      </div>
    </>
  );
}

export default DateSelector;
