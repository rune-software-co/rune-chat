
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Pencil } from "lucide-react";
import { toast } from "sonner";

type UserProfileProps = {
  username: string;
  currentUser: boolean;
};

export const UserProfile = ({ username, currentUser }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(() => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const user = users.find((u: any) => u.username === username);
    return user?.about || "";
  });
  const [bannerUrl, setBannerUrl] = useState(() => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const user = users.find((u: any) => u.username === username);
    return user?.bannerUrl || "";
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const user = users.find((u: any) => u.username === username);
    return user?.avatarUrl || "";
  });

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const updatedUsers = users.map((user: any) => {
      if (user.username === username) {
        return {
          ...user,
          about,
          bannerUrl,
          avatarUrl
        };
      }
      return user;
    });
    localStorage.setItem("chatAppUsers", JSON.stringify(updatedUsers));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleImageUpload = (type: 'avatar' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'avatar') {
          setAvatarUrl(imageUrl);
        } else {
          setBannerUrl(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-900 min-h-full">
      <div className="relative">
        <div className="h-48 w-full bg-gray-800 relative">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900/50 to-gray-800" />
          )}
          {currentUser && (
            <label className="absolute bottom-2 right-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload('banner', e)}
              />
              <Camera className="text-white hover:text-purple-400" />
            </label>
          )}
        </div>
        
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-gray-900">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl bg-purple-900">
                {username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {currentUser && (
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('avatar', e)}
                />
                <Camera className="text-white hover:text-purple-400" />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{username}</h1>
          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write something about yourself..."
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        ) : (
          <p className="text-gray-400">{about || "No bio yet."}</p>
        )}
      </div>
    </div>
  );
};
