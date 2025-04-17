
import { Bell, Menu, Search, X, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarProps = {
  currentUser: { username: string; displayName: string } | null;
  onLogout: () => void;
};

export const Navbar = ({ currentUser, onLogout }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (!currentUser) return null;

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
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8 bg-purple-800 text-white cursor-pointer">
              <AvatarImage src="/avatar-placeholder.png" alt={currentUser.displayName} />
              <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] bg-gray-800 border-gray-700 text-gray-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.displayName}</p>
                <p className="text-xs text-gray-400">@{currentUser.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-400 hover:text-red-400 hover:bg-gray-700 focus:bg-gray-700"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
