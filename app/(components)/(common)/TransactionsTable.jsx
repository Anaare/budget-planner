import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function TransactionsTable({ transactions, handleEdit, handleDelete }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Amount
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Description
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Type
          </th>
          {/* Actions Header: Centered for better alignment with the buttons */}
          <th
            scope="col"
            className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <tr
            // IMPORTANT: Use a unique ID from your data (e.g., transaction._id) as the key
            // 'index' is generally not recommended if items can be added, removed, or reordered.
            key={transaction._id}
            className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {/* Format date for better readability */}
              {new Date(transaction.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-800">
              ${transaction.amount.toFixed(2)}
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-800">
              {transaction.description}
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-800">
              {transaction.category}
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
              <span
                className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        transaction.type === "Income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
              >
                {transaction.type}
              </span>
            </td>
            {/* Actions Cell: Centered content with styled buttons */}
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-center text-sm font-medium">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(transaction)}
                className="inline-flex items-center justify-center p-2 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out"
                title="Edit Transaction"
              >
                <FaRegEdit className="h-5 w-5" /> {/* Larger icon size */}
              </button>
              {/* Spacer for a slight gap between buttons */}
              <span className="inline-block w-2"></span>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(transaction._id)}
                className="inline-flex items-center justify-center p-2 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out"
                title="Delete Transaction"
              >
                <MdDelete className="h-5 w-5" /> {/* Larger icon size */}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionsTable;
