import { useEffect } from "react";
import { useForm } from "react-hook-form";

function TransactionForm({ onClose, onTransactionSuccess, initialData }) {
  // useForm setup:
  // - register: For registering inputs.
  // - handleSubmit: For handling form submission.
  // - reset: For resetting form fields.
  // - setValue: For programmatically setting form values (used for initialData).
  const { register, handleSubmit, reset, setValue } = useForm();

  // Determine if the form is in editing mode
  const isEditing = !!initialData; // isEditing is true if initialData is provided

  // useEffect to populate form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      // If initialData is available, populate the form fields
      // Format date to 'YYYY-MM-DD' for date input type
      setValue(
        "date",
        initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : ""
      );
      setValue("amount", initialData.amount);
      setValue("description", initialData.description);
      setValue("category", initialData.category);
      setValue("type", initialData.type);
      setValue("userId", initialData.userId);
    } else {
      // If no initialData, reset the form for adding a new transaction
      reset();
      // Set default date to today for new transactions
      setValue("date", new Date().toISOString().split("T")[0]);
      // Set a default userId if not authenticated or for demo
      setValue("userId", "demoUser123");
    }
  }, [initialData, reset, setValue]); // Dependencies for useEffect

  // Function to handle form submission (both add and edit)
  const onSubmit = async (data) => {
    let response;
    let url = "/api/transactions"; // Default URL for POST (add)
    let method = "POST"; // Default method for POST (add)

    if (isEditing) {
      // If in editing mode, change URL and method for PUT request
      url = `/api/transactions/${initialData._id}`;
      method = "PUT";
    }

    try {
      response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Transaction saved successfully:", result.data);
        reset(); // Reset the form fields
        onClose(); // Close the modal
        // Call the success callback to trigger data re-fetch in parent
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }
      } else {
        console.error(
          "Error saving transaction:",
          result.message || response.statusText
        );
        // Optionally display an error message to the user
        alert(`Error: ${result.message || "Failed to save transaction."}`);
      }
    } catch (error) {
      console.error("Network error saving transaction:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow-inner" // Adjusted bg-white from bg-background
    >
      {/* Date Field */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          Date
        </label>
        <input
          type="date"
          {...register("date", { required: true })}
          id="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
        />
      </div>

      {/* Amount Field */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          Amount
        </label>
        <input
          type="number"
          {...register("amount", { required: true, valueAsNumber: true })}
          id="amount"
          step="0.01"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
          placeholder="e.g., 150.75"
        />
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          Description
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
          placeholder="e.g., Monthly salary, Freelance project, Gift"
        />
      </div>

      {/* Category Field */}
      <div>
        {" "}
        {/* Wrapped in a div for consistent spacing */}
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          Category
        </label>
        <select
          {...register("category", { required: true })} // Added required
          id="category"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
        >
          <option value="">Select a category</option>{" "}
          {/* Added default empty option */}
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
          <option value="Gift">Gift</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Type Field */}
      <div>
        {" "}
        {/* Wrapped in a div for consistent spacing */}
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          Type
        </label>
        <select
          {...register("type", { required: true })} // Added required
          id="type"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
        >
          <option value="">Select type</option>{" "}
          {/* Added default empty option */}
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* User ID Field - Consider making this dynamic with auth later */}
      <div>
        {" "}
        {/* Wrapped in a div for consistent spacing */}
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 mb-1" // Adjusted text color
        >
          User ID
        </label>
        <input
          type="text" // Changed to text input as it's a specific ID
          {...register("userId", { required: true })}
          id="userId"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" /* Added text-gray-900 */
          placeholder="e.g., user123"
        />
      </div>

      {/* Submit and Close Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        {" "}
        {/* Adjusted spacing and alignment */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {isEditing ? "Save Changes" : "Add Transaction"}{" "}
          {/* Dynamic button text */}
        </button>
        <button
          type="button" // Important: set type="button" to prevent accidental form submission
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
