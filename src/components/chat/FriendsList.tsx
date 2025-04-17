
import { useState } from "react";
import { Check, Plus, Search, UserPlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for friends
const initialFriends = [
  { id: "1", name: "Alex Johnson", avatar: null, status: "online", lastSeen: null },
  { id: "2", name: "Maria Garcia", avatar: null, status: "offline", lastSeen: "2 hours ago" },
  { id: "3", name: "James Smith", avatar: null, status: "idle", lastSeen: null },
  { id: "4", name: "Sarah Wilson", avatar: null, status: "online", lastSeen: null },
];

export const FriendsList = ({ onSelectFriend }: { onSelectFriend: (friend: any) => void }) => {
  const [friends, setFriends] = useState(initialFriends);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFriend = () => {
    if (newFriendName.trim()) {
      const newFriend = {
        id: (friends.length + 1).toString(),
        name: newFriendName,
        avatar: null,
        status: "offline",
        lastSeen: "just now"
      };
      setFriends([...friends, newFriend]);
      setNewFriendName("");
      setIsAddingFriend(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Friends</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAddingFriend(!isAddingFriend)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isAddingFriend ? <X size={20} /> : <UserPlus size={20} />}
          </Button>
        </div>
        
        {isAddingFriend ? (
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Friend's name"
              className="bg-gray-800 border-gray-700 text-gray-200"
            />
            <Button 
              size="icon" 
              onClick={addFriend}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Check size={16} />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search friends"
              className="pl-9 bg-gray-800 border-gray-700 text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3">
          <p className="px-2 text-xs font-medium text-gray-400 uppercase">Online - {filteredFriends.filter(f => f.status === "online").length}</p>
          {filteredFriends
            .filter(friend => friend.status === "online")
            .map(friend => (
              <button
                key={friend.id}
                className="w-full px-2 py-2 mt-1 flex items-center rounded-md hover:bg-gray-800 text-left"
                onClick={() => onSelectFriend(friend)}
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 bg-purple-900 text-white">
                    <AvatarImage src={friend.avatar || ""} alt={friend.name} />
                    <AvatarFallback>{friend.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 rounded-full h-3 w-3 ${getStatusColor(friend.status)} border-2 border-gray-900`}></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">{friend.name}</p>
                </div>
              </button>
            ))}
        </div>

        <div className="px-2 py-3">
          <p className="px-2 text-xs font-medium text-gray-400 uppercase">Offline - {filteredFriends.filter(f => f.status !== "online").length}</p>
          {filteredFriends
            .filter(friend => friend.status !== "online")
            .map(friend => (
              <button
                key={friend.id}
                className="w-full px-2 py-2 mt-1 flex items-center rounded-md hover:bg-gray-800 text-left"
                onClick={() => onSelectFriend(friend)}
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 bg-gray-700 text-white">
                    <AvatarImage src={friend.avatar || ""} alt={friend.name} />
                    <AvatarFallback>{friend.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 rounded-full h-3 w-3 ${getStatusColor(friend.status)} border-2 border-gray-900`}></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{friend.name}</p>
                  <p className="text-xs text-gray-600">{friend.lastSeen}</p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
