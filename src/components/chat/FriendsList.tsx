
import { useState, useEffect } from "react";
import { Check, Plus, Search, UserPlus, X, UserRound, UserX, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type Friend = {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  status: string;
  lastSeen: string | null;
};

type FriendsListProps = {
  onSelectFriend: (friend: any) => void;
  currentUser: { username: string; displayName: string };
};

export const FriendsList = ({ onSelectFriend, currentUser }: FriendsListProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Load friends from localStorage
  useEffect(() => {
    loadFriendsData();
  }, [currentUser.username]);

  const loadFriendsData = () => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const currentUserData = users.find((u: any) => u.username === currentUser.username);
    
    if (currentUserData) {
      // Get friends
      const friendsList = currentUserData.friends || [];
      const friendsData = friendsList.map((friendUsername: string) => {
        const friend = users.find((u: any) => u.username === friendUsername);
        if (friend) {
          return {
            id: friend.username,
            username: friend.username,
            name: friend.displayName,
            avatar: null,
            status: Math.random() > 0.5 ? "online" : "offline", // Simulate random status
            lastSeen: "Recently"
          };
        }
        return null;
      }).filter(Boolean);
      
      setFriends(friendsData);
      
      // Get friend requests
      const requests = currentUserData.friendRequests || [];
      const requestsData = requests.map((reqUsername: string) => {
        const requester = users.find((u: any) => u.username === reqUsername);
        if (requester) {
          return {
            username: requester.username,
            displayName: requester.displayName
          };
        }
        return null;
      }).filter(Boolean);
      
      setFriendRequests(requestsData);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFriend = () => {
    if (!newFriendUsername.trim()) return;
    
    const username = newFriendUsername.trim();
    
    // Don't allow adding yourself
    if (username === currentUser.username) {
      toast.error("You can't add yourself as a friend");
      return;
    }
    
    // Check if already friends
    if (friends.some(f => f.username === username)) {
      toast.error("Already in your friends list");
      return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    
    // Check if user exists
    const targetUser = users.find((u: any) => u.username === username);
    if (!targetUser) {
      toast.error("User not found");
      return;
    }
    
    // Send friend request (add to target user's friend requests)
    const updatedUsers = users.map((user: any) => {
      if (user.username === username) {
        const requests = user.friendRequests || [];
        if (!requests.includes(currentUser.username)) {
          requests.push(currentUser.username);
        }
        return { ...user, friendRequests: requests };
      }
      return user;
    });
    
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    setNewFriendUsername("");
    setIsAddingFriend(false);
    toast.success(`Friend request sent to ${targetUser.displayName}`);
  };

  const acceptFriendRequest = (username: string) => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    
    // Update current user's data
    const updatedUsers = users.map((user: any) => {
      if (user.username === currentUser.username) {
        // Remove from requests and add to friends
        const updatedRequests = (user.friendRequests || []).filter((req: string) => req !== username);
        const updatedFriends = [...(user.friends || [])];
        if (!updatedFriends.includes(username)) {
          updatedFriends.push(username);
        }
        return { 
          ...user, 
          friendRequests: updatedRequests,
          friends: updatedFriends
        };
      } else if (user.username === username) {
        // Add current user to target's friends list
        const updatedFriends = [...(user.friends || [])];
        if (!updatedFriends.includes(currentUser.username)) {
          updatedFriends.push(currentUser.username);
        }
        return { ...user, friends: updatedFriends };
      }
      return user;
    });
    
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    loadFriendsData();
    toast.success("Friend request accepted!");
  };

  const rejectFriendRequest = (username: string) => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    
    // Update current user's data
    const updatedUsers = users.map((user: any) => {
      if (user.username === currentUser.username) {
        // Remove from requests
        const updatedRequests = (user.friendRequests || []).filter((req: string) => req !== username);
        return { ...user, friendRequests: updatedRequests };
      }
      return user;
    });
    
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    loadFriendsData();
    toast.success("Friend request rejected");
  };

  const removeFriend = (username: string) => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    
    // Update both users' friend lists
    const updatedUsers = users.map((user: any) => {
      if (user.username === currentUser.username || user.username === username) {
        const updatedFriends = (user.friends || []).filter((friend: string) => 
          friend !== (user.username === currentUser.username ? username : currentUser.username)
        );
        return { ...user, friends: updatedFriends };
      }
      return user;
    });
    
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    loadFriendsData();
    toast.success("Friend removed");
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
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              placeholder="Friend's username"
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

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 mb-0 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            onClick={() => setActiveTab("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="online" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            onClick={() => setActiveTab("online")}
          >
            Online
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white relative"
            onClick={() => setActiveTab("pending")}
          >
            Pending
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-1 overflow-y-auto mt-0 p-0">
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <UserRound size={48} className="mb-2 text-gray-600" />
              <p className="text-center">No friends yet. Add someone to get started!</p>
            </div>
          ) : (
            <div className="px-2 py-3">
              {filteredFriends.map(friend => (
                <div 
                  key={friend.id}
                  className="group relative w-full px-2 py-2 mt-1 flex items-center rounded-md hover:bg-gray-800"
                >
                  <button 
                    className="flex-1 flex items-center text-left"
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
                      <p className="text-xs text-gray-500">{friend.status === "online" ? "Online" : friend.lastSeen}</p>
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-400 hover:bg-gray-700 invisible group-hover:visible"
                    onClick={() => removeFriend(friend.username)}
                  >
                    <UserX size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="online" className="flex-1 overflow-y-auto mt-0 p-0">
          {filteredFriends.filter(f => f.status === "online").length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <p className="text-center">No friends online at the moment</p>
            </div>
          ) : (
            <div className="px-2 py-3">
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
                      <span className="absolute bottom-0 right-0 rounded-full h-3 w-3 bg-green-500 border-2 border-gray-900"></span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-200">{friend.name}</p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="flex-1 overflow-y-auto mt-0 p-0">
          {friendRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <Mail size={48} className="mb-2 text-gray-600" />
              <p className="text-center">No pending friend requests</p>
            </div>
          ) : (
            <div className="px-2 py-3">
              <p className="px-2 text-xs font-medium text-gray-400 uppercase mb-2">Incoming Requests</p>
              {friendRequests.map(request => (
                <div
                  key={request.username}
                  className="px-2 py-2 mt-1 rounded-md bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 bg-purple-900 text-white">
                      <AvatarFallback>{request.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium text-gray-200">{request.displayName}</p>
                      <p className="text-xs text-gray-500">@{request.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 h-8"
                      onClick={() => acceptFriendRequest(request.username)}
                    >
                      <Check size={14} className="mr-1" /> Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-700 h-8"
                      onClick={() => rejectFriendRequest(request.username)}
                    >
                      <X size={14} className="mr-1" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
