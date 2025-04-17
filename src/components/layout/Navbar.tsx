
import { Bell, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        {isSearchOpen ? (
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <Input
              type="text"
              placeholder="Search for friends, groups or messages..."
              className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-purple-500"
              autoFocus
            />
            <button 
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button 
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={20} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500"></span>
        </button>
        <Avatar className="h-8 w-8 bg-purple-800 text-white">
          <AvatarImage src="/avatar-placeholder.png" alt="User" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
