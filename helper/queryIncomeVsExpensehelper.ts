import mongoose from "mongoose";

interface queryProps {
  userId: string;
  startDate: string;
  endDate: string;
}

export function buildIncomeVsExpense({
  userId,
  startDate,
  endDate,
}: queryProps) {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  // Date range
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }
  //dun forget to add deletedAt field in expense collection
  //also dun forget to update the delete function of expense collection
  const IncomeVsExpense: any[] = [
    {
      $addFields: {
        type: "income",
      },
    },
    { $match: match },
    {
      $unionWith: {
        coll: "expenses",
        pipeline: [
          // Add type field for expenses
          {
            $addFields: {
              type: "expense",
            },
          },
          // Apply the same filters to expenses
          { $match: match },
        ],
      },
    },
    {
      $addFields: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        incomeForeachMonth: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "income"] },
              then: "$amount",
              else: 0,
            },
          },
        },
        expenseForeachMonth: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "expense"] },
              then: "$amount",
              else: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the group _id
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            "$_id.month",
          ],
        },
        incomeForeachMonth: 1,
        expenseForeachMonth: 1,
        netsavingforeachMonth: {
          $subtract: ["$incomeForeachMonth", "$expenseForeachMonth"],
        },
      },
    },
    { $sort: { year: 1, month: 1 } },
  ];
  return { IncomeVsExpense };
}
