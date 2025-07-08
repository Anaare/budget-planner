import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "Budget must be associated with a user."],
      index: true,
    },
    month: {
      type: String,
      required: [true, "Please provide a month for this budget."],
    },
    year: {
      type: Number,
      required: [true, "Please provide a year for this budget."],
      min: [2000, "Year must be 2000 or later."],
      max: [2100, "Year must be 2100 or earlier."],
    },
    income: {
      type: Number,
      required: [true, "Please provide an income for the month."],
      min: [0, "Income cannot be negative."],
      default: 0,
    },

    expenses: {
      type: Map,
      of: Number,
      default: {
        Food: 0,
        Transport: 0,
        Entertainment: 0,
        Bills: 0,
        Shopping: 0,
        Other: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);

export default Budget;
