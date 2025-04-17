
import { useState } from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Settings, BarChart2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Team", href: "/team" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className={cn("font-bold transition-opacity", 
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          StartupOS
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon size={20} />
            <span className={cn(
              "transition-opacity",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};
