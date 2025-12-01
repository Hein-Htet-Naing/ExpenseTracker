"use client";
import {
  LayoutDashboard,
  CircleDollarSign,
  FileChartColumnIncreasing,
  Grid2X2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: <CircleDollarSign />,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: <Grid2X2 />,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: <FileChartColumnIncreasing />,
  },
];
export const Sidebar = () => {
  const pathName = usePathname();
  return (
    <aside className="overflow-hidden w-15 hover:w-64 transition duration-300 ease-in transform bg-card border-r min-h-screen mt-10 z-9 **group**">
      <nav className="p-4 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathName === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="**opacity-0 transition-opacity duration-300 group-hover:opacity-300**">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
