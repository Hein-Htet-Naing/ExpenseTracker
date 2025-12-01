import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";

interface dashBoardLayoutProps {
  children: React.ReactNode;
}
export default function DashBoardLayout({ children }: dashBoardLayoutProps) {
  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 mt-8">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
