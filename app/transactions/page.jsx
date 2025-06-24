"use client";
import { useState } from "react";
import { transactions } from "../(lib)/transactions";

function Transactions() {
  return (
    <div className="overflow-x-auto  rounded-lg shadow-md border border-gray-200">
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
              className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg"
            >
              Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {transaction.date}
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
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                >
                  {transaction.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
