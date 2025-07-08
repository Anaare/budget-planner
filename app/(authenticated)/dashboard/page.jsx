"use client";
import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import getTransactionsData from "@/app/(lib)/getTransactionsData";
import {
  sevenDays,
  thirtyDays,
  yearlyExpense,
  yearlyIncome,
} from "@/app/(lib)/calculations";
import numeral from "numeral";

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

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactionsData();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching data for Dashboard:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total expense and income across ALL transactions (All Time)
  const totalExpense = numeral(yearlyExpense(transactions)).format("$0,0.00");
  const totalIncome = numeral(yearlyIncome(transactions)).format("$0,0.00");

  // Filter transactions for the last 7 and 30 days
  const transactionsLast7Days = sevenDays(transactions);
  const transactionsLast30Days = thirtyDays(transactions);

  // Helper function to group transactions by category and sum their values
  const groupTransactionsByCategory = (filteredTransactions, type) => {
    return filteredTransactions
      .filter((t) => t.type === type)
      .reduce((acc, t) => {
        const category = t.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + t.value;
        return acc;
      }, {});
  };

  // --- Prepare Pie Chart Data for Last 30 Days: Group Expenses by Category ---
  const expensesByCategoryLast30Days = groupTransactionsByCategory(
    transactionsLast30Days,
    "Expense"
  );
  const pieChartData30Days = Object.entries(expensesByCategoryLast30Days).map(
    ([name, value]) => ({ name, value })
  );
  const displayPieChartData30Days =
    pieChartData30Days.length > 0
      ? pieChartData30Days
      : [{ name: "No Data", value: 1, fill: "#CCCCCC" }];

  // --- Prepare Pie Chart Data for Last 30 Days: Group Income by Category ---
  const incomeByCategoryLast30Days = groupTransactionsByCategory(
    transactionsLast30Days,
    "Income"
  );
  const pieChartData30DaysIncome = Object.entries(
    incomeByCategoryLast30Days
  ).map(([name, value]) => ({ name, value }));
  const displayPieChartData30DaysIncome =
    pieChartData30DaysIncome.length > 0
      ? pieChartData30DaysIncome
      : [{ name: "No Data", value: 1, fill: "#CCCCCC" }];

  // --- Prepare Pie Chart Data for Last 7 Days: Group Expenses by Category ---
  const expensesByCategoryLast7Days = groupTransactionsByCategory(
    transactionsLast7Days,
    "Expense"
  );
  const pieChartData7Days = Object.entries(expensesByCategoryLast7Days).map(
    ([name, value]) => ({ name, value })
  );
  const displayPieChartData7Days =
    pieChartData7Days.length > 0
      ? pieChartData7Days
      : [{ name: "No Data", value: 1, fill: "#CCCCCC" }];

  // --- Prepare Pie Chart Data for Last 7 Days: Group Income by Category ---
  const incomeByCategoryLast7Days = groupTransactionsByCategory(
    transactionsLast7Days,
    "Income"
  );
  const pieChartData7DaysIncome = Object.entries(incomeByCategoryLast7Days).map(
    ([name, value]) => ({ name, value })
  );
  const displayPieChartData7DaysIncome =
    pieChartData7DaysIncome.length > 0
      ? pieChartData7DaysIncome
      : [{ name: "No Data", value: 1, fill: "#CCCCCC" }];

  // Custom label rendering function for the Pie Chart slices
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
    // Only show labels for slices that are large enough to avoid clutter
    if (percent < 0.05) {
      return null;
    }

    // Calculate position for the label slightly outside the slice
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

  // Calculate total income for last 30 days
  const totalIncomeLast30Days = numeral(
    yearlyIncome(transactionsLast30Days)
  ).format("$0,0.00");
  // Calculate total expenses for last 30 days (for the card)
  const totalExpenseLast30Days = numeral(
    yearlyExpense(transactionsLast30Days)
  ).format("$0,0.00");
  // Calculate net balance for last 30 days
  const netBalanceLast30Days = numeral(
    yearlyIncome(transactionsLast30Days) - yearlyExpense(transactionsLast30Days)
  ).format("$0,0.00");

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
          <p className="text-3xl font-semibold text-green-400">{totalIncome}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Total Expenses</h2>
          <p className="text-3xl font-semibold text-red-400">{totalExpense}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Net Balance</h2>
          <p className="text-3xl font-semibold text-blue-400">
            {numeral(
              yearlyIncome(transactions) - yearlyExpense(transactions)
            ).format("$0,0.00")}
          </p>
        </div>
      </div>

      {/* Overview Cards (Last 30 Days) */}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-center text-gray-800">
        Last 30 Days Overview
      </h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Total Income</h2>
          <p className="text-3xl font-semibold text-green-400">
            {totalIncomeLast30Days}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Total Expenses</h2>
          <p className="text-3xl font-semibold text-red-400">
            {totalExpenseLast30Days}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-2 text-white">Net Balance</h2>
          <p className="text-3xl font-semibold text-blue-400">
            {netBalanceLast30Days}
          </p>
        </div>
      </div>

      {/* Conditional Rendering for Charts based on loading/error */}
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
