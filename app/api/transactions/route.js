import dbConnect from "../../(utils)/dbConnect";
import Transaction from "../../(models)/TransactionSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const days = parseInt(searchParams.get("days"));

    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let query = {};
    if (!isNaN(days) && days > 0) {
      const today = new Date();
      const cutoffDate = new Date(today.getTime());
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query.date = { $gte: cutoffDate };
    }

    const sortOptions = {};

    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);

    return NextResponse.json(
      {
        success: true,
        data: transactions,
        page,
        totalPages,
        totalTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const newTransaction = new Transaction(body);
    await newTransaction.save();
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
