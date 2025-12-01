import { expenseModel } from "@/model/Expenses";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { title, amount, category, date, description } = await request.json();
    //update data
    const updateExpense = await expenseModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          amount: amount,
          category: category,
          date: date,
          description: description,
        },
      },
      {
        new: true,
      }
    );
    return NextResponse.json({
      success: true,
      data: updateExpense,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await expenseModel.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error: any) {
    console.error("deleting error" + error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Serve Error",
      },
      {
        status: 500,
      }
    );
  }
}
