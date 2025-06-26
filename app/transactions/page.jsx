"use client";
import { useEffect, useState } from "react";
import TransactionForm from "../(components)/(common)/TransactionForm";
import Modal from "../(components)/(common)/Modal";
import TransactionsTable from "../(components)/(common)/TransactionsTable";
import DeleteConfirmation from "../(components)/(common)/DeleteConfirmation";
import toast, { Toaster } from "react-hot-toast";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (days) => {
    setActiveFilter(days);
    setPage(1);
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setTransactionToEdit(null);
    fetchTransactions();
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDeleteId(null);
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      let queryString = `/api/transactions?page=${page}&limit=${limit}`;
      if (activeFilter !== null) {
        // Changed to check against null to include 0 if ever needed
        queryString += `&days=${activeFilter}`;
      }

      const response = await fetch(queryString);
      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setTransactions(result.data);
          setTotalPages(result.totalPages);
        } else {
          const errorMessage =
            result.message || "Failed to load transactions from API.";
          setError(errorMessage);
          toast.error(errorMessage);
          console.error("API Error:", result.message);
        }
      } else {
        const errorMessage = `Server error: ${response.status} - ${
          result.message || response.statusText
        }`;
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("HTTP Error:", response.status, result.message);
      }
    } catch (err) {
      const errorMessage = "Network error or failed to parse response.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    openFormModal();
  };

  const handleDeleteClick = (id) => {
    setTransactionToDeleteId(id);
    openDeleteModal();
  };

  const handleConfirmDelete = async (id) => {
    try {
      setError(null);

      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Transaction deleted successfully:", id);
        toast.success("Transaction deleted successfully!");
        closeDeleteModal();
      } else {
        const errorMessage = result.message || "Failed to delete transaction";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Delete API Error:", result.message);
      }
    } catch (err) {
      const errorMessage = "Network error or failed to delete transaction.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Delete Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" /> {/* Added position for toaster */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Transactions
      </h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 justify-between items-center">
        {" "}
        {/* Added flex-col/row and items-center for responsiveness and alignment */}
        <button
          className="add-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setTransactionToEdit(null);
            openFormModal();
          }}
        >
          Add A Transaction
        </button>
        <div className="filter flex space-x-2">
          {" "}
          {/* Added flex and space-x for filter buttons */}
          <button
            className={`
              py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                activeFilter === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            `}
            onClick={() => handleFilterClick(null)}
          >
            All Time
          </button>
          <button
            className={`
              py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                activeFilter === 7
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            `}
            onClick={() => handleFilterClick(7)}
          >
            7 Days
          </button>
          <button
            className={`
              py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                activeFilter === 14
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            `}
            onClick={() => handleFilterClick(14)}
          >
            14 Days
          </button>
          <button
            className={`
              py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                activeFilter === 30
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            `}
            onClick={() => handleFilterClick(30)}
          >
            30 Days
          </button>
        </div>
      </div>
      {transactions.length > 0 ? (
        <>
          <TransactionsTable
            transactions={transactions}
            handleDelete={handleDeleteClick}
            handleEdit={handleEditClick}
          />

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
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-gray-600 text-center text-3xl mt-10">
          You don't have any transactions yet.. 👀 add some 😎
        </h1>
      )}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={transactionToEdit ? "Edit Transaction" : "Add New Transaction"}
      >
        <TransactionForm
          onClose={closeFormModal}
          onTransactionSuccess={fetchTransactions}
          initialData={transactionToEdit}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
      >
        <DeleteConfirmation
          transactionId={transactionToDeleteId}
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
        />
      </Modal>
    </div>
  );
}

export default Transactions;
