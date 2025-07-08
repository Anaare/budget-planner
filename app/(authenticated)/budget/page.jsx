// page.jsx
"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ExpenseSelector from "@/app/(components)/(common)/ExpenseSelector";
import IncomeSelector from "@/app/(components)/(common)/IncomeSelector";
import DateSelector from "@/app/(components)/(common)/DateSelector";

function Page() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState({
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Bills: 0,
    Shopping: 0,
    Other: 0,
  });

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const handleIncomeChange = (e) => {
    const newIncome = parseFloat(e.target.value) || 0;
    setMonthlyIncome(newIncome);
  };

  const handleExpenseChange = (categoryName, newValue) => {
    const newExpenseValue = parseFloat(newValue) || 0;

    setMonthlyExpenses((prevExp) => {
      const updatedExpenses = {
        ...prevExp,
        [categoryName]: newExpenseValue,
      };

      const totalCurrentExpenses = Object.values(updatedExpenses).reduce(
        (a, b) => a + b,
        0
      );

      if (totalCurrentExpenses > monthlyIncome && monthlyIncome !== 0) {
        toast.error("Total expenses cannot exceed your income.", {
          id: "expense-error",
        });
      } else {
        toast.dismiss("expense-error");
      }

      return updatedExpenses;
    });
  };

  const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce(
    (a, b) => a + b,
    0
  );
  const remainingBudget = monthlyIncome - totalMonthlyExpenses;

  const reset = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setMonthlyIncome(0);
    setMonthlyExpenses({
      Food: 0,
      Transport: 0,
      Entertainment: 0,
      Bills: 0,
      Shopping: 0,
      Other: 0,
    });
  };

  const onSubmit = async ({ month, year, income, expenses }) => {
    let response;
    let url = "/api/budget";
    let method = "POST";

    try {
      if (!month || !year || income === 0) {
        toast.error("Please select month, year, and enter income.");
        return;
      }

      response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, income, expenses }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Budget saved successfully!");
        reset();
      } else {
        console.error(
          "Error saving budget:",
          result.message || response.statusText
        );
        toast.error(`Error: ${result.message || "Failed to save budget."}`);
      }
    } catch (error) {
      console.error("Network error saving budget:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-gray-800">
      <Toaster position="top-right" />{" "}
      <h1 className="text-3xl font-extrabold text-center">Plan Your Budget</h1>
      <DateSelector
        month={selectedMonth}
        onMonthChange={handleMonthChange}
        year={selectedYear}
        onYearChange={handleYearChange}
      />
      <IncomeSelector value={monthlyIncome} onChange={handleIncomeChange} />
      <ExpenseSelector value={monthlyExpenses} onChange={handleExpenseChange} />
      {remainingBudget >= 0 ? (
        <h4 className="mt-4 text-xl font-semibold text-green-700">
          Remaining Budget: ${remainingBudget.toFixed(2)}
        </h4>
      ) : (
        <h4 className="mt-4 text-xl font-semibold text-red-700">
          Budget Deficit: ${Math.abs(remainingBudget).toFixed(2)}
        </h4>
      )}
      <button
        type="button"
        onClick={() =>
          onSubmit({
            month: selectedMonth,
            year: Number(selectedYear),
            income: monthlyIncome,
            expenses: monthlyExpenses,
          })
        }
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        Add budget of the month
      </button>
    </div>
  );
}

export default Page;
