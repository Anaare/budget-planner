import { parseISO, isBefore, subDays, startOfDay, isAfter } from "date-fns";

export const yearlyExpense = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "Expense") {
      return sum + transaction.value;
    }
    return sum;
  }, 0);
};

export const yearlyIncome = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "Income") {
      return sum + transaction.value;
    }
    return sum;
  }, 0);
};

export const expense30Days = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "Expense") {
      return sum + transaction.value;
    }
    return sum;
  }, 0);
};

/* Last 7 days */
export const sevenDays = (transactions) => {
  const today = startOfDay(new Date());
  const sevenDaysAgo = startOfDay(subDays(today, 7));

  const lastSevenDays = transactions.filter((transaction) => {
    const transactionDate = startOfDay(parseISO(transaction.date));
    return (
      !isBefore(transactionDate, sevenDaysAgo) &&
      !isAfter(transactionDate, today)
    );
  });

  return lastSevenDays;
};

/* Last 30 days */

export const thirtyDays = (transactions) => {
  const today = startOfDay(new Date());
  const thirtyDaysAgo = startOfDay(subDays(today, 30));

  const lastThirtyDays = transactions.filter((transaction) => {
    const transactionDate = startOfDay(parseISO(transaction.date));
    return (
      !isBefore(transactionDate, thirtyDaysAgo) &&
      !isAfter(transactionDate, today)
    );
  });

  return lastThirtyDays;
};
