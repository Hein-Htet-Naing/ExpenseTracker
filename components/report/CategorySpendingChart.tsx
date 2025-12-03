"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { CategorySpending } from "@/types/report";
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategorySpendingChartProps {
  categorySpending: CategorySpending[];
}
export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({
  categorySpending,
}) => {
  const chartData = {
    labels: categorySpending.map((item) => item.categoryName),
    datasets: [
      {
        data: categorySpending.map((item) => item.amount),
        backgroundColor: categorySpending.map((item) => item.categoryColor),
        borderColor: categorySpending.map((item) => item.categoryColor),
        hoverOffset: 4,
      },
    ],
  };
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            const label = tooltipItem.label;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
  };
  const totalAmount = categorySpending.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          Distribution of your spending across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-1/2 mr-auto ml-auto h-[400px] max-w-[400px]">
          {categorySpending.length < 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <Doughnut data={chartData} options={options} />
          )}
        </div>
        {categorySpending.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
