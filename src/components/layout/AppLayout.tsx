
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

const AppLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
