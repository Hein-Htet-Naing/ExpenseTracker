"use client";
import { formatCurrency } from "@/lib/utils";
import { ExpenseSummary } from "@/types/report";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
}
export const ExpenseSummaryCards: React.FC<ExpenseSummaryCardsProps> = ({
  summary,
}) => {
  // console.log(summary.totalExpenses?.[0].total);
  const totalExpenses = summary.totalExpenses?.[0].total;
  const monthlyAverage = summary.monthlyAverage?.[0].avgPerMonth;
  const countExpenses = summary.countExpenses?.[0].count;
  const topCategory = summary.topCategories?.[0].name;
  const Cards = [
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      description: "All time total spending",
      icon: "💰",
    },
    {
      title: "Monthly Average",
      value: formatCurrency(monthlyAverage),
      description: "Average spending per month",
      icon: "📅",
    },
    {
      title: "Total Expenses",
      value: countExpenses,
      description: "Number of expense records",
      icon: "📊",
    },
    {
      title: "Top Category",
      value: topCategory,
      description: `Spent ${formatCurrency(
        summary.topCategories?.[0].totalAmount ?? 0
      )}`,
      icon: "🎯",
    },
  ];

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-4 w-full">
        {Cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <span className="text-xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
