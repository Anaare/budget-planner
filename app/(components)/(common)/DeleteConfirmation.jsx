const DeleteConfirmation = ({ transactionId, onConfirm, onCancel }) => {
  const handleConfirmClick = () => {
    if (transactionId) {
      onConfirm(transactionId); // Call the parent's handleConfirmDelete with the ID
    }
    console.log(transactionId);
  };

  return (
    <div className="p-4 text-center">
      <p className="text-lg text-gray-700 mb-6">
        Are you sure you want to delete this transaction? This action cannot be
        undone.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleConfirmClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel} // Simply close the modal
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200"
        >
          No, Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
