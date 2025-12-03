"use client";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header: React.FC = () => {
  const { logout, user } = useAuth();
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto container px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full"></div>
          <span className="font-bold text-xl">ExpenseTracker</span>
        </div>

        <div className="flex items-center space-x-4">
          <Card className="border-none bg-transparent p-2 rounded-lg">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">Hello, {user?.name}</span>
              </div>
            </CardContent>
          </Card>
          <Button onClick={logout} variant="outline" size="lg">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
