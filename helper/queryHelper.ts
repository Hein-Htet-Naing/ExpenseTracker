import mongoose, { ObjectId } from "mongoose";

interface queryProps {
  userId: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  categoryIds?: string[];
}

export function buildExpenseQueryAndPipeline({
  userId,
  startDate,
  endDate,
  minAmount,
  maxAmount,
  categoryIds,
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

  // Amount range
  if (minAmount !== undefined || maxAmount !== undefined) {
    match.amount = {};
    if (minAmount !== undefined) match.amount.$gte = minAmount;
    if (maxAmount !== undefined) match.amount.$lte = maxAmount;
  }

  // Categories
  if (categoryIds && categoryIds.length > 0) {
    match.categoryId = {
      $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  // Aggregation pipeline
  const pipeline: any[] = [
    { $match: match },
    {
      $facet: {
        totalExpenses: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
        monthlyAverage: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
              },
              monthlyTotal: { $sum: "$amount" },
            },
          },
          {
            $group: {
              _id: null,
              avgPerMonth: { $avg: "$monthlyTotal" },
            },
          },
        ],
        countExpenses: [{ $count: "count" }],
        topCategories: [
          {
            $group: {
              _id: "$categoryId",
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { totalAmount: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $project: {
              _id: 0,
              categoryId: "$_id",
              name: "$category.name",
              color: "$category.color",
              totalAmount: 1,
              count: 1,
            },
          },
        ],
      },
    },
  ];
  const MonthlySpendingPipeline: any[] = [
    { $match: match },
    {
      $facet: {
        monthlyBreakdown: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
              },
              totalSpent: { $sum: "$amount" },
              expenseCount: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              totalAmount: "$totalSpent",
              expenseCount: "$expenseCount",
            },
          },

          { $limit: 12 },
        ],
      },
    },
  ];
  //   { $match: match },
  //   {
  //     $facet: {
  //       monthlyBreakdown: [
  //         {
  //           $group: {
  //             _id: {
  //               year: { $year: "$createdAt" },
  //               month: { $month: "$createdAt" },
  //             },
  //             totalSpent: { $sum: "$amount" },
  //             expenseCount: { $sum: 1 },
  //           },
  //         },
  //         // NEW: Add $project to flatten and clean the data
  //         {
  //           $project: {
  //             _id: 0, // Remove the _id field
  //             year: "$_id.year",
  //             month: "$_id.month",
  //             totalAmount: "$totalSpent",
  //             expenseCount: "$expenseCount",
  //           },
  //         },
  //         {
  //           $sort: { "_id.year": 1, "_id.month": 1 },
  //         },
  //         { $limit: 12 },
  //       ],
  //     },
  //   },
  // ];

  return { pipeline, MonthlySpendingPipeline };
}
