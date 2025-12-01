import { expenseModel } from "@/model/Expenses";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id } = await request.json();
  //if no Id
  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Expense is not founded!",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const fetchExpense = await expenseModel.findById(id);
    if (!fetchExpense) {
      return NextResponse.json(
        { success: false, message: "No Expense Existed" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user: fetchExpense });
  } catch (error: any) {
    console.error("Error in listByid:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
//when u forget to add "await" at the front of userModel, it returns
//This returns a Mongoose Query object,
// not the actual user document. When NextResponse.json()
// tries to JSON.stringify it, it hits a circular reference
// — hence the error.
