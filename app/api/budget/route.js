import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/app/(utils)/dbConnect";
import Budget from "@/app/(models)/BudgetSchema";

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
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { success: false, message: "Year query parameter is required." },
        { status: 400 }
      );
    }

    const query = {
      userId: session.user.email,
      year: parseInt(year),
    };

    if (month) {
      query.month = month;
      const budget = await Budget.findOne(query);
      return NextResponse.json(
        budget
          ? { success: true, data: budget }
          : { success: true, message: "Budget not found.", data: null },
        { status: 200 }
      );
    } else {
      const budgets = await Budget.find(query);
      return NextResponse.json(
        { success: true, data: budgets },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching budget(s):", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch: " + error.message },
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
    const { month, year, income, expenses } = body;

    if (!month || !year) {
      return NextResponse.json(
        { success: false, message: "Month and year are required." },
        { status: 400 }
      );
    }

    const query = {
      userId: session.user.email,
      month: month,
      year: year,
    };

    const update = {
      income: income,
      expenses: expenses,
    };

    const budget = await Budget.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    });

    const status = budget ? 200 : 201;
    const message = budget
      ? "Budget updated successfully!"
      : "Budget created successfully!";

    return NextResponse.json(
      { success: true, message: message, data: budget },
      { status: status }
    );
  } catch (error) {
    console.error("Error saving budget:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A budget for this month and year already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to save budget: " + error.message },
      { status: 500 }
    );
  }
}
