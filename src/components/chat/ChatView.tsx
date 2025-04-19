import { useState, useRef, useEffect } from "react";
import { Image, PaperclipIcon, Send, Smile, User, Users, X, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  imageUrl?: string;
  receiverId?: string;
  groupId?: string;
};

type ChatViewProps = {
  selectedChat: { id: string; name: string; type: "friend" | "group"; members?: string[] } | null;
  currentUser: { username: string; displayName: string };
};

export const ChatView = ({ selectedChat, currentUser }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [availableFriends, setAvailableFriends] = useState<any[]>([]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChat, currentUser.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedChat?.type === "group") {
      const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
      const currentUserData = users.find((u: any) => u.username === currentUser.username);
      if (currentUserData?.friends) {
        const friends = currentUserData.friends
          .map((friendUsername: string) => {
            const friend = users.find((u: any) => u.username === friendUsername);
            return friend ? {
              username: friend.username,
              displayName: friend.displayName
            } : null;
          })
          .filter(Boolean);
        setAvailableFriends(friends);
      }
    }
  }, [selectedChat, currentUser.username]);

  const loadMessages = () => {
    if (!selectedChat) return;
    
    let chatMessages: Message[] = [];
    
    if (selectedChat.type === "friend") {
      const allMessages = JSON.parse(localStorage.getItem("chatAppMessages") || "[]");
      
      chatMessages = allMessages.filter((msg: Message) => {
        const participants = [currentUser.username, selectedChat.id];
        return (
          (participants.includes(msg.sender) && 
           msg.receiverId === (msg.sender === currentUser.username ? selectedChat.id : currentUser.username))
        );
      });
    } else {
      const groupMessages = JSON.parse(localStorage.getItem("chatAppGroupMessages") || "[]");
      chatMessages = groupMessages.filter((msg: Message) => msg.groupId === selectedChat.id);
    }
    
    const processedMessages = chatMessages.map((msg: Message) => ({
      ...msg,
      isCurrentUser: msg.sender === currentUser.username
    }));
    
    processedMessages.sort((a: Message, b: Message) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    setMessages(processedMessages);
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !imagePreview) || !selectedChat) return;
    
    const now = new Date();
    const messageId = `msg-${Date.now()}`;
    
    const newMsg: Message = {
      id: messageId,
      sender: currentUser.username,
      content: newMessage.trim(),
      timestamp: now.toISOString(),
      imageUrl: imagePreview || undefined
    };
    
    if (selectedChat.type === "friend") {
      const directMessage = {
        ...newMsg,
        receiverId: selectedChat.id
      };
      
      const allMessages = JSON.parse(localStorage.getItem("chatAppMessages") || "[]");
      allMessages.push(directMessage);
      localStorage.setItem("chatAppMessages", JSON.stringify(allMessages));
    } else {
      const groupMessage = {
        ...newMsg,
        groupId: selectedChat.id
      };
      
      const groupMessages = JSON.parse(localStorage.getItem("chatAppGroupMessages") || "[]");
      groupMessages.push(groupMessage);
      localStorage.setItem("chatAppGroupMessages", JSON.stringify(groupMessages));
      
      const groups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
      const updatedGroups = groups.map((group: any) => {
        if (group.id === selectedChat.id) {
          return {
            ...group,
            lastMessage: {
              sender: currentUser.username,
              content: newMessage.trim() || (imagePreview ? "Sent an image" : ""),
              timestamp: now.toISOString()
            }
          };
        }
        return group;
      });
      localStorage.setItem("chatAppGroups", JSON.stringify(updatedGroups));
    }
    
    const uiMessage = {
      ...newMsg,
      isCurrentUser: true
    };
    
    setMessages(prev => [...prev, uiMessage]);
    setNewMessage("");
    setImagePreview(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday " + format(date, "h:mm a");
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  const getUserDisplayName = (username: string) => {
    if (username === currentUser.username) return "You";
    
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const user = users.find((u: any) => u.username === username);
    return user ? user.displayName : username;
  };

  const isGroupCreator = () => {
    if (!selectedChat || selectedChat.type !== "group") return false;
    const groups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const group = groups.find((g: any) => g.id === selectedChat.id);
    return group?.createdBy === currentUser.username;
  };

  const addMemberToGroup = (username: string) => {
    const groups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const updatedGroups = groups.map((group: any) => {
      if (group.id === selectedChat?.id && !group.members.includes(username)) {
        return {
          ...group,
          members: [...group.members, username],
          lastMessage: {
            sender: "System",
            content: `${username} was added to the group`,
            timestamp: new Date().toISOString()
          }
        };
      }
      return group;
    });
    localStorage.setItem("chatAppGroups", JSON.stringify(updatedGroups));
    loadMessages();
  };

  const removeMemberFromGroup = (username: string) => {
    const groups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
    const updatedGroups = groups.map((group: any) => {
      if (group.id === selectedChat?.id) {
        return {
          ...group,
          members: group.members.filter((m: string) => m !== username),
          lastMessage: {
            sender: "System",
            content: `${username} was removed from the group`,
            timestamp: new Date().toISOString()
          }
        };
      }
      return group;
    });
    localStorage.setItem("chatAppGroups", JSON.stringify(updatedGroups));
    loadMessages();
  };

  const handleProfileClick = (username: string) => {
    window.open(`/profile/${username}`, '_blank');
  };

  const renderMembersList = () => {
    if (!selectedChat?.members) return null;
    
    return (
      <div className="space-y-2">
        {selectedChat.members.map((member: string) => (
          <div key={member} className="flex items-center justify-between">
            <span className="text-gray-300">{getUserDisplayName(member)}</span>
            {member !== currentUser.username && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMemberFromGroup(member)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            {selectedChat?.type === "friend" ? (
              <User size={32} className="text-purple-500" />
            ) : (
              <Users size={32} className="text-purple-500" />
            )}
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Select a conversation</h2>
          <p className="text-gray-500 text-center">Choose a friend or group to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar 
              className="h-10 w-10 bg-purple-900 text-white cursor-pointer"
              onClick={() => selectedChat.type === "friend" ? handleProfileClick(selectedChat.id) : null}
            >
              <AvatarImage src="" alt={selectedChat?.name} />
              <AvatarFallback>{selectedChat?.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h2 className="font-medium text-white">{selectedChat?.name}</h2>
              <p className="text-xs text-gray-400">
                {selectedChat?.type === "friend" ? "Online" : "Group chat"}
              </p>
            </div>
          </div>
          
          {selectedChat?.type === "group" && isGroupCreator() && (
            <Button
              variant="ghost"
              onClick={() => setShowGroupSettings(!showGroupSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings size={20} />
            </Button>
          )}
        </div>
        
        {showGroupSettings && selectedChat?.type === "group" && isGroupCreator() && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">Manage Members</h3>
            <div className="space-y-2">
              {availableFriends.map((friend) => (
                <div key={friend.username} className="flex items-center justify-between">
                  <span className="text-gray-300">{friend.displayName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addMemberToGroup(friend.username)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
            
            <h3 className="text-sm font-medium text-white mt-4 mb-2">Current Members</h3>
            {renderMembersList()}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id}
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {!message.isCurrentUser && (
                <Avatar 
                  className="h-8 w-8 mr-2 bg-purple-900 text-white cursor-pointer"
                  onClick={() => selectedChat.type === "friend" ? 
                    handleProfileClick(selectedChat.id) : 
                    handleProfileClick(message.sender)}
                >
                  <AvatarFallback>{getUserDisplayName(message.sender)[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${message.isCurrentUser ? 'bg-purple-700' : 'bg-gray-800'} rounded-lg p-3`}>
                {!message.isCurrentUser && selectedChat.type === "group" && (
                  <p className="text-xs font-medium text-purple-400 mb-1">{getUserDisplayName(message.sender)}</p>
                )}
                
                {message.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={message.imageUrl} 
                      alt="Shared" 
                      className="rounded-md max-h-48 w-auto"
                    />
                  </div>
                )}
                
                {message.content && <p className="text-white">{message.content}</p>}
                
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              
              {message.isCurrentUser && (
                <Avatar className="h-8 w-8 ml-2 bg-purple-900 text-white">
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="p-2 border-t border-gray-800">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-md" />
            <button 
              className="absolute top-1 right-1 bg-gray-900 text-white rounded-full p-1"
              onClick={() => setImagePreview(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Image size={20} />
          </Button>
          <Button 
            onClick={handleSendMessage}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
