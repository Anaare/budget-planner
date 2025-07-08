async function getBudgetData(year) {
  try {
    const URL = `/api/budget?year=${year}`;

    const response = await fetch(URL, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch transactions: ${
          errorData.message || response.statusText
        }`
      );
    }
    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      console.warn("API response did not contain expected data", result);
      return [];
    }

    const data = result.data.map((item) => ({
      month: item.month,
      year: Number(item.year),
      expenses: item.expenses,
      income: item.income,
    }));

    console.log("Fetched and transformed budget data:", data);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default getBudgetData;
