import { useForm } from "react-hook-form";

function TransactionForm({ onClose }) {
  // Added onClose prop
  const { register, handleSubmit, reset } = useForm(); // Added reset from useForm

  const onSubmit = async (data) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      reset(); // Reset the form fields
      onClose(); // close modal
      window.location.reload(); // or better: re-fetch transactions without reload
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-background rounded-lg shadow-xl"
    >
      {/* Date Field */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Date
        </label>
        <input
          type="date"
          {...register("date", { required: true })} // Added required validation
          id="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {/* You could add error messages here if validation fails */}
      </div>

      {/* Amount Field */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Amount
        </label>
        <input
          type="number"
          {...register("amount", { required: true, valueAsNumber: true })} // Added required and valueAsNumber
          id="amount"
          step="0.01" // Allows decimal values
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., 150.75"
        />
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Description
        </label>
        <textarea
          {...register("description")} // Corrected to description
          id="description"
          rows="3" // Makes the textarea taller
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Monthly salary, Freelance project, Gift"
        />
      </div>

      {/* Categories */}
      <label
        htmlFor="category"
        className="block text-sm font-medium text-foreground mb-1"
      >
        Category
      </label>
      <select
        {...register("category")}
        id="category"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Salary">Salary</option>
        <option value="Gift">Gift</option>
        <option value="Other">Other</option>
      </select>

      {/* Type */}
      <label
        htmlFor="category"
        className="block text-sm font-medium text-foreground mb-1"
      >
        Type
      </label>
      <select
        {...register("type")}
        id="type"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      {/* Static user for now it'll change with data from DB */}
      {/* Type */}
      <label
        htmlFor="userId"
        className="block text-sm font-medium text-foreground mb-1"
      >
        User Id
      </label>
      <select
        {...register("userId")}
        id="userId"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="user134">user134</option>
      </select>
      {/* Submit Button */}
      <div className="flex space-x-3 items-center justify-center">
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Transaction
        </button>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
