"use client";
import { Bar } from "react-chartjs-2";
import { MonthlySpending } from "@/types/report";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
// types.ts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);
interface MonthlySpendingProps {
  monthlySpending: MonthlySpending[];
}
// mockData.ts
export const MonthlySpendingChart: React.FC<MonthlySpendingProps> = ({
  monthlySpending,
}) => {
  //we substring month here
  const monthlySpendBreakdown = monthlySpending.map((item) => ({
    year: item.year,
    month: new Date(item.year, Number(item.month) - 1)
      .toLocaleString("default", { month: "long" })
      .substring(0, 3),
    totalAmount: item.totalAmount,
  }));
  // console.log(monthlySpendBreakdown.map((item) => item.month));
  const chartData = {
    labels: monthlySpendBreakdown.map((item) => item.month),
    datasets: [
      {
        label: "Total Spending",
        data: monthlySpendBreakdown.map((item) => item.totalAmount),
        backgroundColor: [
          `hsl(9, 100%, 70%)`,
          `hsl(120, 61%, 50%)`,
          `hsl(39, 100%, 50%)`,
          `hsl(223, 74%, 57%)`,
          `hsl(271, 76%, 53%)`,
        ],
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 50,
      },
    ],
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].dataset.label;
          },
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            const label = tooltipItem.label;
            // Returns the month and formatted amount, e.g., "January: $1,234.56"
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Your spending pattern over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: "400px", maxWidth: "600px" }}>
          {monthlySpendBreakdown.length < 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
