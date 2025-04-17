
import { useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for groups
const initialGroups = [
  { id: "1", name: "Design Team", members: 5, lastMessage: "Sarah: The new mockups look great!" },
  { id: "2", name: "Project Alpha", members: 8, lastMessage: "Alex: When is the deadline?" },
  { id: "3", name: "Gaming Squad", members: 4, lastMessage: "James: Anyone up for a game tonight?" },
];

export const GroupsList = ({ onSelectGroup }: { onSelectGroup: (group: any) => void }) => {
  const [groups, setGroups] = useState(initialGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: (groups.length + 1).toString(),
        name: newGroupName,
        members: 1,
        lastMessage: "You created this group"
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setIsAddingGroup(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Groups</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAddingGroup(!isAddingGroup)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isAddingGroup ? <X size={20} /> : <Plus size={20} />}
          </Button>
        </div>
        
        {isAddingGroup ? (
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
            <Button 
              size="sm" 
              onClick={addGroup}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Create
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search groups"
              className="pl-9 bg-gray-800 border-gray-700 text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3">
          {filteredGroups.map(group => (
            <button
              key={group.id}
              className="w-full px-2 py-2 mt-1 flex items-center rounded-md hover:bg-gray-800 text-left"
              onClick={() => onSelectGroup(group)}
            >
              <Avatar className="h-9 w-9 bg-purple-900 text-white">
                <AvatarFallback>
                  {group.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 overflow-hidden">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-200">{group.name}</p>
                  <div className="ml-2 flex items-center text-xs text-gray-500">
                    <Users size={12} className="mr-1" />
                    <span>{group.members}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate">{group.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
