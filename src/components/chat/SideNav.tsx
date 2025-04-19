
import { useState } from "react";
import { Settings, Users, MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type SideNavProps = {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onLogout: () => void;
};

export const SideNav = ({ activeTab, onChangeTab }: SideNavProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-16'} bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 transition-all duration-300`}>
      <div className="mb-8 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mb-2 text-gray-500 hover:text-white hover:bg-gray-800"
        >
          <Menu size={20} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        {!isCollapsed && (
          <div className="text-xs text-purple-500 font-semibold whitespace-nowrap">
            RuneChat
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col items-center gap-2">
        <Button
          variant={activeTab === "direct" ? "default" : "ghost"}
          size="icon"
          onClick={() => onChangeTab("direct")}
          className={activeTab === "direct" 
            ? "bg-purple-600 hover:bg-purple-700 text-white" 
            : "text-gray-500 hover:text-white hover:bg-gray-800"
          }
        >
          <MessageSquare size={20} />
          <span className="sr-only">Direct Messages</span>
        </Button>
        
        <Button
          variant={activeTab === "groups" ? "default" : "ghost"}
          size="icon"
          onClick={() => onChangeTab("groups")}
          className={activeTab === "groups" 
            ? "bg-purple-600 hover:bg-purple-700 text-white" 
            : "text-gray-500 hover:text-white hover:bg-gray-800"
          }
        >
          <Users size={20} />
          <span className="sr-only">Groups</span>
        </Button>
        
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          size="icon"
          onClick={() => onChangeTab("settings")}
          className={activeTab === "settings" 
            ? "bg-purple-600 hover:bg-purple-700 text-white" 
            : "text-gray-500 hover:text-white hover:bg-gray-800"
          }
        >
          <Settings size={20} />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
};

