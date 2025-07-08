"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  BarChart, // Added BarChart
  Bar, // Added Bar
  XAxis, // Added XAxis
  YAxis, // Added YAxis
  CartesianGrid, // Added CartesianGrid
} from "recharts";
import getTransactionsData from "@/app/(lib)/getTransactionsData";

import {
  sevenDays,
  thirtyDays,
  calculateTotalExpense, // Renamed from yearlyExpense
  calculateTotalIncome, // Renamed from yearlyIncome
  filterTransactionsByMonthAndYear, // New filter function
  getBudgetVsActualData, // New bar chart data prep function
} from "@/app/(lib)/calculations";
import numeral from "numeral";
import getBudgetData from "@/app/(lib)/getBudgetData";
import { getMonth, getYear, format } from "date-fns";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Orange
  "#FF8042", // Deep Orange
  "#AF19FF", // Purple
  "#FF19A3", // Pink
  "#19FFFF", // Cyan
  "#FF5733", // Red-Orange
  "#C70039", // Dark Red
];

/* FILTERING MUST BE ADDED LET'S SAY MONTHLY AND YEARLY MAYBE */
/* ALSO I SHOULD ADD PROBABLY BAR CHART WITH BUDGET AND ACCORDING BALANCE MONTHLY */

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for monthly/yearly filter
  const currentMonthIndex = getMonth(new Date());
  const currentYear = getYear(new Date());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactionsData();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions data for Dashboard:", err);
        setError(err);
      } finally {
        // This setLoading(false) will be handled by the budget fetch's finally block
      }
    };
    fetchTransactions();
  }, []);

  // Fetch budget data for the selected year
  useEffect(() => {
    const fetchBudget = async () => {
      // Defensive check: Ensure selectedYear is a valid number before proceeding
      // This helps prevent "ReferenceError" if selectedYear is somehow not initialized yet
      if (typeof selectedYear !== "number" || isNaN(selectedYear)) {
        console.warn(
          "selectedYear is not a valid number, skipping budget fetch."
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getBudgetData(selectedYear); // Pass the year directly
        setBudget(data);
      } catch (err) {
        console.error("Error fetching budget data for Dashboard:", err);
        setError(err);
      } finally {
        setLoading(false); // This will be the final loading state setter for initial data
      }
    };
    fetchBudget();
  }, [selectedYear]); // Re-fetch budget data when selectedYear changes

  const totalExpenseAllTime = numeral(
    calculateTotalExpense(transactions)
  ).format("$0,0.00");
  const totalIncomeAllTime = numeral(calculateTotalIncome(transactions)).format(
    "$0,0.00"
  );
  const netBalanceAllTime = numeral(
    calculateTotalIncome(transactions) - calculateTotalExpense(transactions)
  ).format("$0,0.00");

  const transactionsLast7Days = sevenDays(transactions);
  const transactionsLast30Days = thirtyDays(transactions);

  const groupTransactionsByCategory = (filteredTransactions, type) => {
    return filteredTransactions
      .filter((t) => t.type === type)
      .reduce((acc, t) => {
        const category = t.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + t.value;
        return acc;
      }, {});
  };

  const expensesByCategoryLast30Days = useMemo(
    () => groupTransactionsByCategory(transactionsLast30Days, "Expense"),
    [transactionsLast30Days]
  );
  const pieChartData30Days = useMemo(
    () =>
      Object.entries(expensesByCategoryLast30Days).map(([name, value]) => ({
        name,
        value,
      })),
    [expensesByCategoryLast30Days]
  );
  const displayPieChartData30Days = useMemo(
    () =>
      pieChartData30Days.length > 0
        ? pieChartData30Days
        : [{ name: "No Data", value: 1, fill: "#CCCCCC" }],
    [pieChartData30Days]
  );

  const incomeByCategoryLast30Days = useMemo(
    () => groupTransactionsByCategory(transactionsLast30Days, "Income"),
    [transactionsLast30Days]
  );
  const pieChartData30DaysIncome = useMemo(
    () =>
      Object.entries(incomeByCategoryLast30Days).map(([name, value]) => ({
        name,
        value,
      })),
    [incomeByCategoryLast30Days]
  );
  const displayPieChartData30DaysIncome = useMemo(
    () =>
      pieChartData30DaysIncome.length > 0
        ? pieChartData30DaysIncome
        : [{ name: "No Data", value: 1, fill: "#CCCCCC" }],
    [pieChartData30DaysIncome]
  );

  const expensesByCategoryLast7Days = useMemo(
    () => groupTransactionsByCategory(transactionsLast7Days, "Expense"),
    [transactionsLast7Days]
  );
  const pieChartData7Days = useMemo(
    () =>
      Object.entries(expensesByCategoryLast7Days).map(([name, value]) => ({
        name,
        value,
      })),
    [expensesByCategoryLast7Days]
  );
  const displayPieChartData7Days = useMemo(
    () =>
      pieChartData7Days.length > 0
        ? pieChartData7Days
        : [{ name: "No Data", value: 1, fill: "#CCCCCC" }],
    [pieChartData7Days]
  );

  const incomeByCategoryLast7Days = useMemo(
    () => groupTransactionsByCategory(transactionsLast7Days, "Income"),
    [transactionsLast7Days]
  );
  const pieChartData7DaysIncome = useMemo(
    () =>
      Object.entries(incomeByCategoryLast7Days).map(([name, value]) => ({
        name,
        value,
      })),
    [incomeByCategoryLast7Days]
  );
  const displayPieChartData7DaysIncome = useMemo(
    () =>
      pieChartData7DaysIncome.length > 0
        ? pieChartData7DaysIncome
        : [{ name: "No Data", value: 1, fill: "#CCCCCC" }],
    [incomeByCategoryLast7Days]
  );

  const transactionsFilteredByMonthYear = useMemo(
    () =>
      filterTransactionsByMonthAndYear(
        transactions,
        selectedMonth,
        selectedYear
      ),
    [transactions, selectedMonth, selectedYear]
  );

  const totalExpenseFiltered = numeral(
    calculateTotalExpense(transactionsFilteredByMonthYear)
  ).format("$0,0.00");
  const totalIncomeFiltered = numeral(
    calculateTotalIncome(transactionsFilteredByMonthYear)
  ).format("$0,0.00");
  const netBalanceFiltered = numeral(
    calculateTotalIncome(transactionsFilteredByMonthYear) -
      calculateTotalExpense(transactionsFilteredByMonthYear)
  ).format("$0,0.00");

  const budgetVsActualChartData = useMemo(
    () => getBudgetVsActualData(transactions, budget, selectedYear),
    [transactions, budget, selectedYear]
  );

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
  }) => {
    if (percent < 0.05) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${name}: ${numeral(value).format("$0,0")}`}{" "}
      </text>
    );
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(currentYear, i, 1), "MMMM"),
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: (currentYear - 2 + i).toString(),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
        Welcome to your Dashboard!
      </h1>
      <p className="mb-6 text-center text-gray-500">
        Your financial overview at a glance.
      </p>

      {/* Overview Cards (All Time) */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        All Time Overview
      </h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Total Income</h2>
          <p className="text-3xl font-semibold text-green-400">
            {totalIncomeAllTime}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Total Expenses</h2>
          <p className="text-3xl font-semibold text-red-400">
            {totalExpenseAllTime}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Net Balance</h2>
          <p className="text-3xl font-semibold text-blue-400">
            {netBalanceAllTime}
          </p>
        </div>
      </div>

      {/* Monthly/Yearly Filter Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-center text-gray-800">
        Monthly/Yearly Analytics
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="p-2 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {yearOptions.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards (Filtered by Month/Year) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">
            Total Income (
            {format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy")})
          </h2>
          <p className="text-3xl font-semibold text-green-400">
            {totalIncomeFiltered}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">
            Total Expenses (
            {format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy")})
          </h2>
          <p className="text-3xl font-semibold text-red-400">
            {totalExpenseFiltered}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">
            Net Balance (
            {format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy")})
          </h2>
          <p className="text-3xl font-semibold text-blue-400">
            {netBalanceFiltered}
          </p>
        </div>
      </div>

      {/* Bar Chart: Budget vs Actual (Monthly) */}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-center text-gray-800">
        Budget vs Actual (Monthly - {selectedYear})
      </h2>
      {loading ? (
        <p className="text-center text-gray-500 mt-8">
          Loading budget chart...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">
          Error loading budget chart: {error.message}
        </p>
      ) : (
        <div className="w-full h-[400px] bg-gray-900 rounded-lg shadow-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetVsActualChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis
                stroke="#999"
                tickFormatter={(value) => numeral(value).format("$0a")}
              />
              <Tooltip
                formatter={(value) => numeral(value).format("$0,0.00")}
              />
              <Legend />
              <Bar
                dataKey="budgetedExpenses"
                fill="#FF8042"
                name="Budgeted Expenses"
              />
              <Bar
                dataKey="actualExpenses"
                fill="#C70039"
                name="Actual Expenses"
              />
              <Bar
                dataKey="budgetedIncome"
                fill="#00C49F"
                name="Budgeted Income"
              />
              <Bar dataKey="actualIncome" fill="#0088FE" name="Actual Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Conditional Rendering for Pie Charts based on loading/error */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading chart data...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">
          Error loading chart: {error.message}
        </p>
      ) : (
        // Grid container for the four pie charts
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Expenses by Category (Last 30 Days) Chart */}
          <div className="bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              Expenses by Category (Last 30 Days)
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieChartData30Days}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {displayPieChartData30Days.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      numeral(value).format("$0,0.00"),
                      name,
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Income by Category (Last 30 Days) Chart */}
          <div className="bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              Income by Category (Last 30 Days)
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieChartData30DaysIncome}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {displayPieChartData30DaysIncome.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      numeral(value).format("$0,0.00"),
                      name,
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses by Category (Last 7 Days) Chart */}
          <div className="bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              Expenses by Category (Last 7 Days)
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieChartData7Days}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {displayPieChartData7Days.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      numeral(value).format("$0,0.00"),
                      name,
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Income by Category (Last 7 Days) Chart */}
          <div className="bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              Income by Category (Last 7 Days)
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieChartData7DaysIncome}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {displayPieChartData7DaysIncome.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      numeral(value).format("$0,0.00"),
                      name,
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
