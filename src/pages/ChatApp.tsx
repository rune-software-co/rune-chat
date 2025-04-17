
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FriendsList } from "@/components/chat/FriendsList";
import { GroupsList } from "@/components/chat/GroupsList";
import { ChatView } from "@/components/chat/ChatView";
import { AuthModal } from "@/components/chat/AuthModal";
import { SideNav } from "@/components/chat/SideNav";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // Check if user is already authenticated (e.g., from localStorage)
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

  const handleAuthenticate = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("chatAppUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("chatAppUser");
    setSelectedChat(null);
  };

  const handleSelectFriend = (friend: any) => {
    setSelectedChat({
      id: friend.id,
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

  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <SideNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onLogout={handleLogout}
        />
        
        <div className="w-64 border-r border-gray-800 overflow-hidden">
          {activeTab === "friends" && (
            <FriendsList onSelectFriend={handleSelectFriend} />
          )}
          {activeTab === "groups" && (
            <GroupsList onSelectGroup={handleSelectGroup} />
          )}
          {activeTab === "direct" && (
            <FriendsList onSelectFriend={handleSelectFriend} />
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ChatView selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
