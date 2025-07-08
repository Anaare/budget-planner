import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../(utils)/dbConnect";
import Transaction from "../../(models)/TransactionSchema";

export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const days = parseInt(searchParams.get("days"));
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const query = { userId: session.user.email };

    if (!isNaN(days) && days > 0) {
      const today = new Date();
      const cutoffDate = new Date(today.getTime());
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query.date = { $gte: cutoffDate };
    }

    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });

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
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const newTransaction = new Transaction({
      ...body,
      userId: session.user.email,
    });

    await newTransaction.save();
    return NextResponse.json(
      { success: true, data: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
