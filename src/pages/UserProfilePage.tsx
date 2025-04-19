
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserProfile } from "@/components/chat/UserProfile";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserFound, setIsUserFound] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user", error);
      }
    }

    // Check if the username exists
    if (username) {
      const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
      const userExists = users.some((user: any) => user.username === username);
      setIsUserFound(userExists);
    }
  }, [username]);

  if (!username) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-xl font-medium text-white mb-4">User not found</h2>
          <p className="mb-4">No username was provided.</p>
          <Button asChild>
            <Link to="/">Go back to chat</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isUserFound) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-xl font-medium text-white mb-4">User not found</h2>
          <p className="mb-4">The user "{username}" does not exist.</p>
          <Button asChild>
            <Link to="/">Go back to chat</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser.username === username;

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="bg-gray-950 p-4 flex items-center border-b border-gray-800">
        <Button asChild variant="ghost" className="text-gray-400 hover:text-white mr-2">
          <Link to="/">
            <ChevronLeft size={20} />
            <span className="ml-2">Back to Chat</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <UserProfile username={username} currentUser={isCurrentUser} />
      </div>
    </div>
  );
};
