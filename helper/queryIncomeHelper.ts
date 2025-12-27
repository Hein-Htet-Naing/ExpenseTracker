import { queryProps } from "./queryHelper";
import mongoose from "mongoose";
export function buildIncomeQueryandPipeline({
  userId,
  startDate,
  endDate,
  minAmount,
  maxAmount,
  IcategoryIds,
}: queryProps) {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
    deletedAt: null,
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
  if (IcategoryIds && IcategoryIds.length > 0) {
    match.categoryId = {
      $in: IcategoryIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  const IncomePipeline: any[] = [
    { $match: match },
    {
      $facet: {
        totalIncome: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
        countIncome: [{ $count: "count" }],
        highestIncome: [
          {
            $group: {
              _id: "$categoryId",
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { totalAmount: -1 },
          },
          {
            $limit: 1,
          },
          {
            $lookup: {
              from: "categories",
              let: { catId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$catId"] },
                        { $eq: ["$deletedAt", null] },
                      ],
                    },
                  },
                },
              ],
              as: "categoryDetails",
            },
          },
          { $unwind: "$categoryDetails" },
          {
            $project: {
              _id: 0,
              categoryId: "$_id",
              name: "$categoryDetails.name",
              color: "$categoryDetails.color",
              totalAmount: 1,
              count: 1,
            },
          },
        ],
      },
    },
  ];

  const IncomeByCategories: any[] = [
    { $match: match },
    {
      $match: { amount: { $gte: 0 } },
    },
    {
      $group: {
        _id: "$categoryId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories",
        let: { catId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$catId"] },
                  { $eq: ["$deletedAt", null] },
                ],
              },
            },
          },
        ],
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $group: {
        _id: null,
        categories: {
          $push: {
            categoryId: "$_id",
            categoryName: "$categoryDetails.name",
            categoryColor: "$categoryDetails.color",
            totalAmount: "$totalAmount",
          },
        },
        overallTotal: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        overallTotal: 1,
        categories: {
          $map: {
            input: "$categories",
            as: "cat",
            in: {
              categoryName: "$$cat.categoryName",
              categoryColor: "$$cat.categoryColor",
              totalAmount: "$$cat.totalAmount",
              percentage: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$$cat.totalAmount", "$overallTotal"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
      },
    },
  ];

  return { IncomePipeline, IncomeByCategories };
}
//expense summary
//edit and change
