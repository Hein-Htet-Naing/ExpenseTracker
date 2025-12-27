"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { incomeByCategories } from "@/types/report";

// Sample data

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IncomeByCategoryChartProps {
  data: incomeByCategories;
  title?: string;
}

export const IncomeByCategoryChart: React.FC<IncomeByCategoryChartProps> = ({
  data,
  title = "Income by Category",
}) => {
  const chartData = {
    labels: data?.categories?.map((item) => item.categoryName),
    datasets: [
      {
        data: data?.categories?.map((item) => item.totalAmount),
        backgroundColor: data?.categories?.map((item) => item.categoryColor),
        borderColor: data?.categories?.map((item) => item.categoryColor),
        borderWidth: 2,
      },
    ],
  };
  const percentage = data?.categories?.map((item) => item.percentage);

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const index = context.dataIndex;
            const percentage = data?.categories?.[index]?.percentage ?? 0;

            return `${label}: $${value.toFixed(2)} (${percentage.toFixed(2)}%)`;
          },
        },
      },
    },
    cutout: "50%",
  };

  const totalAmount = data?.overallTotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Distribution of your income across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-1/2 mx-auto h-[400px] max-w-[400px]">
          {data?.categories?.length > 0 ? (
            <Doughnut data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>

        {data?.categories?.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total Income:{" "}
              <span className="font-semibold text-green-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
