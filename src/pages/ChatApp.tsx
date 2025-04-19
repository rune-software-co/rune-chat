import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FriendsList } from "@/components/chat/FriendsList";
import { GroupsList } from "@/components/chat/GroupsList";
import { ChatView } from "@/components/chat/ChatView";
import { AuthModal } from "@/components/chat/AuthModal";
import { SideNav } from "@/components/chat/SideNav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "@/components/chat/SettingsMenu";
import { UserProfile } from "@/components/chat/UserProfile";
import { NotificationsView } from "@/components/chat/NotificationsView";

type User = {
  username: string;
  displayName: string;
};

type Chat = {
  id: string;
  name: string;
  type: "friend" | "group";
};

const ChatApp = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [userFriends, setUserFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("chatAppUsers")) {
      localStorage.setItem("chatAppUsers", JSON.stringify([]));
    }
    if (!localStorage.getItem("chatAppMessages")) {
      localStorage.setItem("chatAppMessages", JSON.stringify([]));
    }
    if (!localStorage.getItem("chatAppGroups")) {
      localStorage.setItem("chatAppGroups", JSON.stringify([]));
    }
    if (!localStorage.getItem("chatAppGroupMessages")) {
      localStorage.setItem("chatAppGroupMessages", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("chatAppUser");
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserFriends();
    }
  }, [currentUser, activeTab]);

  const loadUserFriends = () => {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const currentUserData = users.find((u: any) => u.username === currentUser.username);
    
    if (currentUserData) {
      const friendsList = currentUserData.friends || [];
      const friendsData = friendsList.map((friendUsername: string) => {
        const friend = users.find((u: any) => u.username === friendUsername);
        if (friend) {
          return {
            id: friend.username,
            username: friend.username,
            name: friend.displayName,
            avatar: null,
            status: Math.random() > 0.5 ? "online" : "offline",
            lastSeen: "Recently"
          };
        }
        return null;
      }).filter(Boolean);
      
      setUserFriends(friendsData);
    }
  };

  const handleAuthenticate = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("chatAppUser", JSON.stringify(user));
    toast.success(`Welcome, ${user.displayName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("chatAppUser");
    setSelectedChat(null);
    toast.success("You have been logged out");
  };

  const handleSelectFriend = (friend: any) => {
    setSelectedChat({
      id: friend.username,
      name: friend.name,
      type: "friend"
    });
  };

  const handleSelectGroup = (group: any) => {
    setSelectedChat({
      id: group.id,
      name: group.name,
      type: "group"
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedChat(null);
  };

  const handleUpdateDisplayName = (newDisplayName: string) => {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const updatedUsers = users.map((user: any) => {
      if (user.username === currentUser.username) {
        return { ...user, displayName: newDisplayName };
      }
      return user;
    });
    
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    setCurrentUser({ ...currentUser, displayName: newDisplayName });
  };

  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="flex-1 flex overflow-hidden">
        <SideNav
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          onLogout={handleLogout}
        />
        
        <div className="w-64 border-r border-gray-800 overflow-hidden">
          {activeTab === "direct" && currentUser && (
            <FriendsList 
              onSelectFriend={handleSelectFriend} 
              currentUser={currentUser} 
            />
          )}
          {activeTab === "groups" && currentUser && (
            <GroupsList 
              onSelectGroup={handleSelectGroup}
              currentUser={currentUser}
              friends={userFriends}
            />
          )}
          {activeTab === "settings" && currentUser && (
            <SettingsMenu 
              currentUser={currentUser}
              onUpdateDisplayName={handleUpdateDisplayName}
            />
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {selectedChat ? (
            <ChatView 
              selectedChat={selectedChat} 
              currentUser={currentUser} 
            />
          ) : (
            currentUser && <UserProfile 
              username={currentUser.username} 
              currentUser={true} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
