
import { useState } from "react";
import { Eye, EyeOff, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthModalProps = {
  onAuthenticate: (user: { username: string; displayName: string }) => void;
};

export const AuthModal = ({ onAuthenticate }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    // For this demo, we'll just simulate authentication
    if (username && password) {
      onAuthenticate({ 
        username,
        displayName: displayName || username
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-gray-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            {isLogin ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {isLogin 
              ? "Enter your credentials to sign in to your account" 
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700 text-gray-200"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="How you'll appear to others"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 bg-gray-800 border-gray-700 text-gray-200"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {isLogin && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => 
                    setRememberMe(checked as boolean)
                  } 
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLogin ? "Sign in" : "Create account"}
            </Button>
            <p className="text-sm text-gray-400 text-center">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
