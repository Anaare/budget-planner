import {
  parseISO,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
  getYear,
  getMonth, // getMonth returns 0-11
  format, // For debugging/logging
} from "date-fns";

/**
 * Calculates the total expense from a list of transactions.
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @returns {number} The total expense.
 */
export const calculateTotalExpense = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "Expense") {
      return sum + transaction.value;
    }
    return sum;
  }, 0);
};

/**
 * Calculates the total income from a list of transactions.
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @returns {number} The total income.
 */
export const calculateTotalIncome = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "Income") {
      return sum + transaction.value;
    }
    return sum;
  }, 0);
};

// Renamed for clarity, original yearlyExpense/Income are now calculateTotalExpense/Income
export const yearlyExpense = calculateTotalExpense;
export const yearlyIncome = calculateTotalIncome;

/**
 * Filters transactions to include only those within the last 7 calendar days.
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @returns {Array<Object>} Filtered array of transactions.
 */
export const sevenDays = (transactions) => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);

  const intervalStart = startOfDay(sevenDaysAgo);
  const intervalEnd = endOfDay(today);

  const lastSevenDays = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return isWithinInterval(transactionDate, {
      start: intervalStart,
      end: intervalEnd,
    });
  });

  return lastSevenDays;
};

/**
 * Filters transactions to include only those within the last 30 calendar days.
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @returns {Array<Object>} Filtered array of transactions.
 */
export const thirtyDays = (transactions) => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const intervalStart = startOfDay(thirtyDaysAgo);
  const intervalEnd = endOfDay(today);

  const lastThirtyDays = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return isWithinInterval(transactionDate, {
      start: intervalStart,
      end: intervalEnd,
    });
  });

  return lastThirtyDays;
};

/**
 * Filters transactions for a specific month and year.
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @param {number} month - The month (0-11, where 0 is January).
 * @param {number} year - The full year (e.g., 2025).
 * @returns {Array<Object>} Filtered array of transactions.
 */
export const filterTransactionsByMonthAndYear = (transactions, month, year) => {
  return transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return (
      getMonth(transactionDate) === month && getYear(transactionDate) === year
    );
  });
};

/**
 * Prepares data for a monthly budget vs. actual bar chart.
 * @param {Array<Object>} allTransactions - All transaction data.
 * @param {Array<Object>} allBudgets - All budget data for the year.
 * @param {number} year - The year for which to prepare the data.
 * @returns {Array<Object>} Formatted data for Recharts BarChart.
 */
export const getBudgetVsActualData = (allTransactions, allBudgets, year) => {
  const monthlyData = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < 12; i++) {
    // Loop through all 12 months
    const monthTransactions = filterTransactionsByMonthAndYear(
      allTransactions,
      i,
      year
    );
    const actualExpenses = calculateTotalExpense(monthTransactions);
    const actualIncome = calculateTotalIncome(monthTransactions);

    // Find the budget for the current month
    const budgetForMonth = allBudgets.find(
      (b) => b.month === monthNames[i] && b.year === year
    );
    const budgetedExpenses = budgetForMonth ? budgetForMonth.expenses : 0;
    const budgetedIncome = budgetForMonth ? budgetForMonth.income : 0;

    monthlyData.push({
      name: monthNames[i], // Month abbreviation for X-axis
      actualExpenses,
      budgetedExpenses,
      actualIncome,
      budgetedIncome,
    });
  }
  return monthlyData;
};
