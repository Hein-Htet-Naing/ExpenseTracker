"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  CalendarDays,
  CircleDollarSign,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next/link";

// Mock data for dashboard - we'll replace this with real data later
const mockStats = {
  totalExpenses: 1250.75,
  monthlyExpenses: 342.5,
  expenseCount: 15,
  topCategory: "Food & Dining",
};

const recentExpenses = [
  {
    id: 1,
    title: "Groceries",
    amount: 85.3,
    category: "Food",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Netflix",
    amount: 15.99,
    category: "Entertainment",
    date: "2024-01-14",
  },
  {
    id: 3,
    title: "Gas",
    amount: 45.0,
    category: "Transportation",
    date: "2024-01-13",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your expenses and financial summary
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <span className="text-xl">
              <CircleDollarSign />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockStats.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">All time total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <span className="text-xl">
              <CalendarDays />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockStats.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">January 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <span className="text-xl">
              <ChartNoAxesCombined />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.expenseCount}</div>
            <p className="text-xs text-muted-foreground">Number of expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <span className="text-xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.topCategory}</div>
            <p className="text-xs text-muted-foreground">Most spent category</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              Your most recent expense transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your expenses quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/expenses/add">➕ Add New Expense</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/expenses">📋 View All Expenses</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/dashboard/reports">📈 View Reports</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
