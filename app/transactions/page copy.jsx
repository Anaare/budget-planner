"use client";

import { useEffect, useState } from "react";
import TransactionForm from "../(components)/(common)/TransactionForm";
import Modal from "../(components)/(common)/Modal";
import TransactionsTable from "../(components)/(common)/TransactionsTable";

function Transactions() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const openIncomeModal = () => setIsIncomeModalOpen(true);
  const closeIncomeModal = () => setIsIncomeModalOpen(false);

  // Pagination

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(`/api/transactions?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (json.success) {
        setTransactions(json.data);
        setTotalPages(json.totalPages);
      } else {
        console.error("Error loading transactions:", json.message);
      }
    };

    fetchTransactions();
  }, [page]);

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
      <TransactionsTable transactions={transactions} />

      <Modal
        isOpen={isIncomeModalOpen}
        onClose={closeIncomeModal}
        title="Add New Transaction"
      >
        <TransactionForm onClose={closeIncomeModal} />
      </Modal>

      <div className="flex space-x-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-600 hover:bg-gray-800 hover:cursor-pointer px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-600 hover:bg-gray-800 hover:cursor-pointer px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Transactions;
