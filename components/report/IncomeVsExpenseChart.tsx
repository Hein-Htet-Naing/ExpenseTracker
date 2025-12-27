"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncomeVsExpenseSummary, MonthlyIncome } from "@/types/report";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export interface MonthlySpending {
  month: string;
  year: number;
  income: number;
  expenses: number;
  netSavings: number;
}

export const sampleData: MonthlySpending[] = [
  {
    month: "January",
    year: 2025,
    income: 5000,
    expenses: 3200,
    netSavings: 1800,
  },
  {
    month: "February",
    year: 2025,
    income: 4800,
    expenses: 3000,
    netSavings: 1800,
  },
  {
    month: "March",
    year: 2025,
    income: 5200,
    expenses: 3500,
    netSavings: 1700,
  },
  {
    month: "April",
    year: 2025,
    income: 5100,
    expenses: 3300,
    netSavings: 1800,
  },
  {
    month: "May",
    year: 2025,
    income: 5300,
    expenses: 3400,
    netSavings: 1900,
  },
  {
    month: "June",
    year: 2025,
    income: 5500,
    expenses: 3600,
    netSavings: 1900,
  },
];

interface IncomeVsExpensesChartProps {
  data: IncomeVsExpenseSummary[];
  incomeByMonthly: MonthlyIncome[];
  title?: string;
}

export const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({
  data,
  incomeByMonthly,
  title = "Income, Expenses, and Net Savings Over Time",
}) => {
  const chartData = {
    labels: data?.map((item) => `${item.month} ${item.year}`),
    datasets: [
      {
        label: "Income",
        data: data.map((item) => item.incomeForeachMonth),
        borderColor: "rgb(34, 197, 94)", // Green for income line
        backgroundColor: "rgba(34, 197, 94, 0.1)", // Light fill (optional)
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
        fill: false, // No fill under the line
        tension: 0.1, // Slight curve for smoothness
      },
      {
        label: "Expenses",
        data: data.map((item) => item.expenseForeachMonth),
        borderColor: "rgb(239, 68, 68)", // Red for expenses line
        backgroundColor: "rgba(239, 68, 68, 0.1)", // Light fill (optional)
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: "Net Savings",
        data: data.map((item) => item.netsavingforeachMonth),
        borderColor: "rgb(59, 130, 246)", // Blue for savings line
        backgroundColor: "rgba(59, 130, 246, 0.1)", // Light fill (optional)
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y!.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Track your income, expenses, and net savings trends over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 mx-auto w-[80%] md:w-full max-w-full">
          {data.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
