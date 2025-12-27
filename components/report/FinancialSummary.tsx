"use client";
import { formatCurrency } from "@/lib/utils";
import { ExpenseSummary, IncomeSummary } from "@/types/report";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
  incomeSummary: IncomeSummary;
}
export const FinancialSummaryCards: React.FC<ExpenseSummaryCardsProps> = ({
  summary,
  incomeSummary,
}) => {
  // console.log(summary.totalExpenses?.[0].total);
  const totalExpenses = summary.totalExpenses?.[0].total;
  const monthlyAverage = summary.monthlyAverage?.[0].avgPerMonth;
  const countExpenses = summary.countExpenses?.[0].count;
  const topCategory = summary.topCategories?.[0].name;
  const totalIncome = incomeSummary.totalIncome[0].total;
  const countIncome = incomeSummary.countIncome[0].count;
  const highestIncome = incomeSummary.highestIncome[0];

  const Savings = totalIncome - totalExpenses;
  const netSaving = (Savings / totalIncome) * 100;
  const Cards = [
    {
      title: "Net Savings",
      value: formatCurrency(Savings),
      description: `Savings Rate: ${
        netSaving >= 0 ? "+" : ""
      }${netSaving.toFixed(1)}%`,
      icon: "🏦",
      color: netSaving >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netSaving >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      description: "All time total spending",
      icon: "💰",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Average Spending",
      value: formatCurrency(monthlyAverage),
      description: "Average spending per month",
      icon: "📅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Number Of Expenses",
      value: countExpenses,
      description: "Number of expense records",
      icon: "📊",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      description: "All time total Income",
      icon: "💵",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Number Of Income",
      value: countIncome,
      description: "Number of incomes records",
      icon: "📊",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Top Spending",
      value: topCategory,
      description: `Spent ${formatCurrency(
        summary.topCategories?.[0].totalAmount ?? 0
      )}`,
      icon: "🎯",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Top Income Source",
      value: highestIncome.name || "None",
      description: formatCurrency(highestIncome.totalAmount),
      icon: "🎯",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-4 w-full">
        {Cards.map((card, index) => (
          <Card key={index} className={card.bgColor}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <span className="text-xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
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
