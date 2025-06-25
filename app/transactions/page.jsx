"use client";
import { useEffect, useState } from "react";
import TransactionForm from "../(components)/(common)/TransactionForm";
import Modal from "../(components)/(common)/Modal";
import TransactionsTable from "../(components)/(common)/TransactionsTable";
import DeleteConfirmation from "../(components)/(common)/DeleteConfirmation";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Renamed for clarity: isFormModalOpen controls the modal for both adding and editing
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New state to store the transaction object currently being edited
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  // State to store the ID of the transaction to be deleted
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of transactions per page

  // Modal handlers for Transaction Form (Add/Edit)
  const openFormModal = () => setIsFormModalOpen(true); // Renamed from openIncomeModal
  const closeFormModal = () => {
    // Renamed from closeIncomeModal
    setIsFormModalOpen(false);
    setTransactionToEdit(null); // Clear transactionToEdit when modal closes
    fetchTransactions(); // Re-fetch transactions after form submission (add/edit)
  };

  // Modal handlers for Delete Confirmation
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDeleteId(null); // Clear the ID when modal closes
    fetchTransactions(); // Re-fetch transactions after potential deletion
  };

  // Function to fetch transactions from the API with pagination
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

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

  /**
   * This function is called when the edit button in TransactionsTable is clicked.
   * It stores the transaction object and opens the form modal for editing.
   * @param {Object} transaction - The full transaction object to be edited.
   */
  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction); // Store the transaction data
    openFormModal(); // Open the form modal
  };

  /**
   * This function is called when the delete button in TransactionsTable is clicked.
   * It stores the ID and opens the confirmation modal.
   * @param {string} id - The ID of the transaction to be deleted.
   */
  const handleDeleteClick = (id) => {
    setTransactionToDeleteId(id); // Store the ID
    openDeleteModal(); // Open the confirmation modal
  };

  /**
   * This function is called by the DeleteConfirmation component when the user
   * confirms the deletion. It makes the actual API call.
   * @param {string} id - The ID of the transaction to delete.
   */
  const handleConfirmDelete = async (id) => {
    try {
      setError(null);

      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Transaction deleted successfully:", id);
        closeDeleteModal(); // Close the modal and trigger re-fetch
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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Transactions
      </h2>
      <div className="flex space-x-4 mb-4">
        <button
          className="add-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setTransactionToEdit(null); // Ensure no transaction is set for editing when adding new
            openFormModal(); // Open the form modal
          }}
        >
          Add A Transaction
        </button>
      </div>

      {/* Pass transactions, handleDeleteClick, and handleEditClick to TransactionsTable */}
      <TransactionsTable
        transactions={transactions}
        handleDelete={handleDeleteClick}
        handleEdit={handleEditClick}
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
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>

      {/* Modal for adding/editing transactions */}
      <Modal
        isOpen={isFormModalOpen} // Controls the form modal
        onClose={closeFormModal}
        title={transactionToEdit ? "Edit Transaction" : "Add New Transaction"}
      >
        <TransactionForm
          onClose={closeFormModal}
          onTransactionSuccess={fetchTransactions} // Callback for both add and edit success
          initialData={transactionToEdit} // Pass the transaction data for editing
        />
      </Modal>

      {/* Delete Confirmation Modal */}
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
