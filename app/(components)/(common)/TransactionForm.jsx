import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

function TransactionForm({ onClose, onTransactionSuccess, initialData }) {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
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
      reset();
      setValue("date", new Date().toISOString().split("T")[0]);
      setValue("userId", session.user.email);
    }
  }, [initialData, reset, setValue, session]);

  const onSubmit = async (data) => {
    let response;
    let url = "/api/transactions";
    let method = "POST";

    if (isEditing) {
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

      if (response.ok) {
        console.log("Transaction saved successfully:", result.data);
        toast.success(
          isEditing
            ? "Transaction updated successfully!"
            : "Transaction added successfully!"
        );
        reset();
        onClose();
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }
      } else {
        console.error(
          "Error saving transaction:",
          result.message || response.statusText
        );
        toast.error(
          `Error: ${result.message || "Failed to save transaction."}`
        );
      }
    } catch (error) {
      console.error("Network error saving transaction:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow-inner"
    >
      <Toaster />
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          id="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount
        </label>
        <input
          type="number"
          {...register("amount", {
            required: "Amount is required",
            valueAsNumber: true,
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
          id="amount"
          step="0.01"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
          placeholder="e.g., 150.75"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          id="description"
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
          placeholder="e.g., Monthly salary, Freelance project, Gift"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          id="category"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
          <option value="Gift">Gift</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Type
        </label>
        <select
          {...register("type", { required: "Type is required" })}
          id="type"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        >
          <option value="">Select type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {isEditing ? "Save Changes" : "Add Transaction"}
        </button>
        <button
          type="button"
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
