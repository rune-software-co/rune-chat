
import { Users, ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart, UsersChart } from "@/components/dashboard/Charts";

const Index = () => {
  const stats = [
    { title: "Total Revenue", value: "$54,239", change: 12.5, icon: DollarSign },
    { title: "Active Users", value: "2,342", change: 18.2, icon: Users },
    { title: "Conversion Rate", value: "4.3%", change: -2.4, icon: TrendingUp },
    { title: "Avg. Order Value", value: "$156", change: 8.3, icon: ArrowUpRight },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <UsersChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
