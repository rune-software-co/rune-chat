
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: 'message' | 'group';
  sender: string;
  content: string;
  timestamp: string;
  groupName?: string;
  senderAvatar?: string;
};

export const NotificationsView = ({ currentUser }: { currentUser: { username: string } }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadUserAvatar = (username: string) => {
    const users = JSON.parse(localStorage.getItem("chatAppUsers") || "[]");
    const user = users.find((u: any) => u.username === username);
    return user?.avatarUrl || "";
  };

  useEffect(() => {
    const loadNotifications = () => {
      const messages = JSON.parse(localStorage.getItem("chatAppMessages") || "[]");
      const messageNotifications = messages
        .filter((msg: any) => msg.receiverId === currentUser.username)
        .map((msg: any) => ({
          id: `msg-${msg.id}`,
          type: 'message',
          sender: msg.sender,
          content: msg.content || 'Sent an image',
          timestamp: msg.timestamp,
          senderAvatar: loadUserAvatar(msg.sender)
        }));

      const groups = JSON.parse(localStorage.getItem("chatAppGroups") || "[]");
      const groupNotifications = groups
        .filter((group: any) => group.members?.includes(currentUser.username))
        .map((group: any) => ({
          id: `group-${group.id}`,
          type: 'group',
          sender: group.creator,
          content: 'Added you to group',
          timestamp: group.createdAt,
          groupName: group.name,
          senderAvatar: loadUserAvatar(group.creator)
        }));

      const allNotifications = [...messageNotifications, ...groupNotifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(allNotifications);
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [currentUser.username]);

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p>No notifications yet</p>
      </div>
    );
  }

  const markAsRead = (notificationId: string) => {
    // You could implement a read status system here
    toast.success("Notification marked as read");
  };

  return (
    <div className="h-full bg-gray-900 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.senderAvatar} />
                <AvatarFallback className="bg-purple-900">
                  {notification.sender[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-white font-medium">
                    {notification.sender}
                    {notification.type === 'group' && (
                      <span className="text-gray-400">
                        {' '}• {notification.groupName}
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {notification.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
