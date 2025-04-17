
import { useState, useEffect } from "react";
import { Plus, Search, Users, X, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type GroupsListProps = {
  onSelectGroup: (group: any) => void;
  currentUser: { username: string; displayName: string };
  friends: any[];
};

export const GroupsList = ({ onSelectGroup, currentUser, friends }: GroupsListProps) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Load groups from localStorage
  useEffect(() => {
    loadGroupsData();
  }, [currentUser.username]);

  const loadGroupsData = () => {
    const storedGroups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const userGroups = storedGroups.filter((group: any) => 
      group.members.includes(currentUser.username)
    );
    setGroups(userGroups);
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriendSelection = (username: string) => {
    setSelectedFriends(prev => 
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };

  const createGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend");
      return;
    }
    
    const allGroups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const groupExists = allGroups.some((g: any) => g.name === newGroupName && g.createdBy === currentUser.username);
    
    if (groupExists) {
      toast.error("You already have a group with this name");
      return;
    }
    
    const newGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      createdBy: currentUser.username,
      createdAt: new Date().toISOString(),
      members: [currentUser.username, ...selectedFriends],
      lastMessage: {
        sender: currentUser.username,
        content: "Created this group",
        timestamp: new Date().toISOString()
      }
    };
    
    allGroups.push(newGroup);
    localStorage.setItem("chatAppGroups", JSON.stringify(allGroups));
    
    setNewGroupName("");
    setSelectedFriends([]);
    setIsCreateDialogOpen(false);
    loadGroupsData();
    toast.success("Group created successfully!");
  };

  const leaveGroup = (groupId: string) => {
    const allGroups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const groupIndex = allGroups.findIndex((g: any) => g.id === groupId);
    
    if (groupIndex >= 0) {
      const group = allGroups[groupIndex];
      
      // If creator is leaving and there are other members, transfer ownership
      if (group.createdBy === currentUser.username && group.members.length > 1) {
        const newMembers = group.members.filter((m: string) => m !== currentUser.username);
        const newOwner = newMembers[0];
        allGroups[groupIndex] = {
          ...group,
          members: newMembers,
          createdBy: newOwner,
          lastMessage: {
            sender: "System",
            content: `${currentUser.displayName} left the group`,
            timestamp: new Date().toISOString()
          }
        };
      } 
      // If creator is leaving and no other members, delete the group
      else if (group.createdBy === currentUser.username) {
        allGroups.splice(groupIndex, 1);
      }
      // If regular member is leaving
      else {
        allGroups[groupIndex] = {
          ...group,
          members: group.members.filter((m: string) => m !== currentUser.username),
          lastMessage: {
            sender: "System",
            content: `${currentUser.displayName} left the group`,
            timestamp: new Date().toISOString()
          }
        };
      }
      
      localStorage.setItem("chatAppGroups", JSON.stringify(allGroups));
      loadGroupsData();
      toast.success("You left the group");
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
            onClick={() => setIsCreateDialogOpen(true)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Plus size={20} />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search groups"
            className="pl-9 bg-gray-800 border-gray-700 text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <Users size={48} className="mb-2 text-gray-600" />
            <p className="text-center">No groups yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="px-2 py-3">
            {filteredGroups.map(group => (
              <div 
                key={group.id}
                className="group relative w-full px-2 py-2 mt-1 flex items-center rounded-md hover:bg-gray-800"
              >
                <button
                  className="flex-1 flex items-center text-left"
                  onClick={() => onSelectGroup(group)}
                >
                  <Avatar className="h-9 w-9 bg-purple-900 text-white">
                    <AvatarFallback>
                      {group.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 overflow-hidden">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-200">{group.name}</p>
                      <div className="ml-2 flex items-center text-xs text-gray-500">
                        <Users size={12} className="mr-1" />
                        <span>{group.members.length}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {group.lastMessage ? (
                        <>
                          <span className="font-medium">
                            {group.lastMessage.sender === currentUser.username 
                              ? "You" 
                              : group.lastMessage.sender === "System"
                              ? ""
                              : getUserDisplayName(group.lastMessage.sender)}
                          </span>
                          {group.lastMessage.sender !== "System" && ": "}
                          {group.lastMessage.content}
                        </>
                      ) : "No messages yet"}
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-400 hover:bg-gray-700 invisible group-hover:visible"
                  onClick={() => leaveGroup(group.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create a new group</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a name and select friends to include in your new group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="group-name" className="text-sm font-medium text-gray-300">Group Name</label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Select Friends</label>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-md bg-gray-800 p-2">
                {friends.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-2">
                    You don't have any friends yet
                  </p>
                ) : (
                  friends.map(friend => (
                    <div key={friend.username} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md">
                      <Checkbox 
                        id={`friend-${friend.username}`}
                        checked={selectedFriends.includes(friend.username)}
                        onCheckedChange={() => toggleFriendSelection(friend.username)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label 
                        htmlFor={`friend-${friend.username}`}
                        className="text-sm text-gray-300 flex items-center"
                      >
                        <Avatar className="h-6 w-6 mr-2 bg-purple-900 text-white">
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {friend.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={createGroup}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!newGroupName.trim() || selectedFriends.length === 0}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get display name from username
const getUserDisplayName = (username: string) => {
  const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
  const user = users.find((u: any) => u.username === username);
  return user ? user.displayName : username;
};
