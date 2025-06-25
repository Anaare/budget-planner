import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Please provide a date for this transaction."],
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount for this transaction."],
      min: [0, "Amount cannot be negative."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
      maxlength: [200, "Description cannot be more than 200 characters."],
    },
    category: {
      type: String,
      required: [true, "Please provide a category."],
      enum: [
        "Food",
        "Transport",
        "Entertainment",
        "Bills",
        "Shopping",
        "Salary",
        "Gift",
        "Other",
      ],
    },
    type: {
      type: String,
      required: [true, "Please specify transaction type (Expense/Income)."],
      enum: ["Expense", "Income"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required for the transaction."],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

export default Transaction;
