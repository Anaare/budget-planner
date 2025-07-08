async function getTransactionsData() {
  try {
    const URL = "/api/transactions";

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

    console.log(result);

    const data = result.data.map((item) => ({
      name: item.description,
      value: item.amount,
      date: item.date,
      type: item.type,
      category: item.category,
    }));

    console.log("Fetched and transformed data:", data);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default getTransactionsData;
