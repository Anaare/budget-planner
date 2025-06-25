"use client"; // This directive is correctly placed for client-side components

import { useEffect, useState } from "react";
import TransactionForm from "../(components)/(common)/TransactionForm";
import Modal from "../(components)/(common)/Modal";
import TransactionsTable from "../(components)/(common)/TransactionsTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Reinstated loading state
  const [error, setError] = useState(null); // Reinstated error state
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of transactions per page

  const openIncomeModal = () => setIsIncomeModalOpen(true);
  const closeIncomeModal = () => {
    setIsIncomeModalOpen(false);
    fetchTransactions(); //
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // API call with page and limit parameters
      const response = await fetch(
        `/api/transactions?page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setTransactions(result.data);
          setTotalPages(result.totalPages);
        } else {
          setError(result.message || "Failed to load transactions from API.");
          console.error("API Error:", result.message);
        }
      } else {
        setError(
          `Server error: ${response.status} - ${
            result.message || response.statusText
          }`
        );
        console.error("HTTP Error:", response.status, result.message);
      }
    } catch (err) {
      setError("Network error or failed to parse response.");
      console.error("Fetch Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // IMPORTANT: Replacing window.confirm with a custom modal for better UX and consistency

    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // Check both HTTP status and custom success flag
        console.log("Transaction deleted successfully:", id);
        // After successful deletion, re-fetch transactions to update the UI
        fetchTransactions();
      } else {
        setError(result.message || "Failed to delete transaction");
        console.error("Delete API Error:", result.message);
      }
    } catch (err) {
      setError("Network error or failed to delete transaction.");
      console.error("Delete Fetch Error:", err);
    }
  };

  // useEffect hook to fetch transactions whenever the 'page' state changes
  useEffect(() => {
    fetchTransactions();
  }, [page]); // Dependency array includes 'page' to re-fetch on page change

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading transactions...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-4 mb-4">
        <button
          className="add-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openIncomeModal}
        >
          Add A Transaction
        </button>
      </div>
      {/* Pass transactions and the handleDelete function to TransactionsTable */}
      <TransactionsTable
        transactions={transactions}
        handleDelete={handleDelete}
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 mt-4 text-gray-700">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="px-2 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0} // Disable if no pages or on last page
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>

      {/* Modal for adding new transactions */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={closeIncomeModal}
        title="Add New Transaction"
      >
        <TransactionForm onClose={closeIncomeModal} />
      </Modal>
    </>
  );
}

export default Transactions;
