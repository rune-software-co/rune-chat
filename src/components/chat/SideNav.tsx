
import { useState } from "react";
import { Settings, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type SideNavProps = {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onLogout: () => void;
};

export const SideNav = ({ activeTab, onChangeTab }: SideNavProps) => {
  return (
    <div className="w-16 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4">
      <div className="mb-8">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          P
        </div>
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
