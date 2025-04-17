
import { useState, useRef, useEffect } from "react";
import { Image, PaperclipIcon, Send, Smile, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  imageUrl?: string;
};

type ChatViewProps = {
  selectedChat: { id: string; name: string; type: "friend" | "group" } | null;
};

export const ChatView = ({ selectedChat }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial messages
  useEffect(() => {
    if (selectedChat) {
      // Mock data - in a real app this would come from a database
      const initialMessages: Message[] = selectedChat.type === "friend" ? [
        {
          id: "1",
          sender: selectedChat.name,
          content: "Hey, how are you?",
          timestamp: new Date(Date.now() - 3600000 * 2),
          isCurrentUser: false
        },
        {
          id: "2",
          sender: "You",
          content: "I'm good! Just working on a new project. How about you?",
          timestamp: new Date(Date.now() - 3600000),
          isCurrentUser: true
        },
        {
          id: "3",
          sender: selectedChat.name,
          content: "I'm doing well too. What kind of project are you working on?",
          timestamp: new Date(Date.now() - 1800000),
          isCurrentUser: false
        }
      ] : [
        {
          id: "1",
          sender: "Alex",
          content: "Hey everyone! Welcome to the group.",
          timestamp: new Date(Date.now() - 7200000),
          isCurrentUser: false
        },
        {
          id: "2",
          sender: "Maria",
          content: "Thanks for creating this group!",
          timestamp: new Date(Date.now() - 3600000),
          isCurrentUser: false
        },
        {
          id: "3",
          sender: "You",
          content: "Glad to have you all here. Let's get started!",
          timestamp: new Date(Date.now() - 1800000),
          isCurrentUser: true,
        }
      ];
      
      setMessages(initialMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if ((newMessage.trim() || imagePreview) && selectedChat) {
      const newMsg: Message = {
        id: (messages.length + 1).toString(),
        sender: "You",
        content: newMessage,
        timestamp: new Date(),
        isCurrentUser: true,
        imageUrl: imagePreview || undefined
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      setImagePreview(null);
    }
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
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <div className="border-b border-gray-800 p-4 flex items-center">
        <Avatar className="h-10 w-10 bg-purple-900 text-white">
          <AvatarImage src="" alt={selectedChat.name} />
          <AvatarFallback>{selectedChat.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h2 className="font-medium text-white">{selectedChat.name}</h2>
          <p className="text-xs text-gray-400">
            {selectedChat.type === "friend" ? "Online" : "Group chat"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div 
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {!message.isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2 bg-purple-900 text-white">
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-[70%] ${message.isCurrentUser ? 'bg-purple-700' : 'bg-gray-800'} rounded-lg p-3`}>
              {!message.isCurrentUser && selectedChat.type === "group" && (
                <p className="text-xs font-medium text-purple-400 mb-1">{message.sender}</p>
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
        ))}
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
