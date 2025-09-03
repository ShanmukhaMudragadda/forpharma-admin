import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  activeTab?: string;
}

export default function Layout({ activeTab = "dashboard" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background-tertiary">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={() => { }} />
        <div className="flex-1 min-w-0 flex flex-col ml-64">
          <Header />
          <main className="flex-1 p-6 overflow-auto bg-background-tertiary">
            <Outlet /> {/* Nested routes render here */}
          </main>
        </div>
      </div>
    </div>
  );
}
