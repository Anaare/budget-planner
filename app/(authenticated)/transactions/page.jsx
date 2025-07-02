"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import DeleteConfirmation from "@/app/(components)/(common)/DeleteConfirmation";
import Filter from "@/app/(components)/(common)/Filter";
import Modal from "@/app/(components)/(common)/Modal";
import Sort from "@/app/(components)/(common)/Sort";
import TransactionForm from "@/app/(components)/(common)/TransactionForm";
import TransactionsTable from "@/app/(components)/(common)/TransactionsTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const handleFilterClick = (days) => {
    setActiveFilter(days);
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      let queryString = `/api/transactions?page=${page}&limit=${limit}`;

      if (activeFilter !== null) queryString += `&days=${activeFilter}`;
      if (sortBy) queryString += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      const response = await fetch(queryString);
      const result = await response.json();

      if (response.ok && result.success) {
        setTransactions(result.data);
        setTotalPages(result.totalPages);
      } else {
        const errorMessage = result.message || "Failed to load transactions.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("API Error:", errorMessage);
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
  }, [page, activeFilter, sortBy, sortOrder]);

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
      <Toaster position="top-right" />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Transactions
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <button
          className="add-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => {
            setTransactionToEdit(null);
            openFormModal();
          }}
        >
          Add A Transaction
        </button>

        {transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Filter
              activeFilter={activeFilter}
              onFilterChange={handleFilterClick}
            />
            <Sort
              handleSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        )}
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
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
