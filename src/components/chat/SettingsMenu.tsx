
import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type SettingsMenuProps = {
  currentUser: {
    username: string;
    displayName: string;
  };
  onUpdateDisplayName: (newName: string) => void;
};

export const SettingsMenu = ({ currentUser, onUpdateDisplayName }: SettingsMenuProps) => {
  const [newDisplayName, setNewDisplayName] = useState(currentUser.displayName);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const theme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(`Theme switched to ${newTheme} mode`);
  };

  const handleUpdateDisplayName = () => {
    if (newDisplayName.trim() === "") {
      toast.error("Display name cannot be empty");
      return;
    }
    onUpdateDisplayName(newDisplayName);
    toast.success("Display name updated successfully");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>Dark Mode</span>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="flex items-center space-x-2">
          <Input
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="Enter new display name"
            className="flex-1"
          />
          <Button onClick={handleUpdateDisplayName} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
