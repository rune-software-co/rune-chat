
import { Bell, Search } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex-1 max-w-md"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
          JS
        </div>
      </div>
    </div>
  );
};
