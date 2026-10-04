"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-provider";

type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const lang = useLanguage();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id || id === "all" ? { ...n, isRead: true } : n));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && notifications.length === 0) {
      setIsLoading(true);
      fetchNotifications().finally(() => setIsLoading(false));
    }
  };

  if (!session?.user) return null;

  const t = {
    title: lang === "en" ? "Notifications" : "বিজ্ঞপ্তি",
    markAll: lang === "en" ? "Mark all as read" : "সব পড়া হয়েছে চিহ্নিত করুন",
    empty: lang === "en" ? "You have no notifications." : "আপনার কোনো বিজ্ঞপ্তি নেই।",
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/80">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl shadow-xl border overflow-hidden bg-background">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h3 className="font-bold">{t.title}</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 text-primary hover:text-primary font-semibold"
              onClick={() => markAsRead("all")}
            >
              <Check className="w-3 h-3 mr-1" /> {t.markAll}
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">{t.empty}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 border-b last:border-b-0 cursor-default transition-colors ${
                    !notif.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                  }`}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notif.isRead ? 'font-bold' : 'font-semibold'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                  </div>
                  <p className={`text-sm text-muted-foreground line-clamp-2 leading-tight ${!notif.isRead ? 'text-foreground/80' : ''}`}>
                    {notif.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
