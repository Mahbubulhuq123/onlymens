"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    name: string | null;
    image: string | null;
    role: string;
  }
};

export default function ChatBox({ bookingId }: { bookingId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?bookingId=${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: session?.user?.id || "",
      sender: {
        name: session?.user?.name || "You",
        image: session?.user?.image || null,
        role: session?.user?.role || "CUSTOMER",
      }
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, content: optimisticMessage.content }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => prev.map(m => m.id === tempId ? savedMsg : m));
      } else {
        // Remove optimistic message if failed
        setMessages((prev) => prev.filter(m => m.id !== tempId));
      }
    } catch (error) {
      setMessages((prev) => prev.filter(m => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-125 max-h-[70vh] bg-background border rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-primary/5 p-4 border-b font-semibold flex items-center gap-2">
        Chat
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70 mt-10">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p>No messages yet. Say hi!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === session?.user?.id;
              
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden ${isMe ? 'bg-primary' : 'bg-muted'}`}>
                    {msg.sender.image ? (
                      <img src={msg.sender.image} alt={msg.sender.name || ""} className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-5 h-5 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <span className="text-[10px] text-muted-foreground mb-1 px-1">
                      {msg.sender.name} • {format(new Date(msg.createdAt), 'p')}
                    </span>
                    <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-3 border-t bg-background flex gap-2">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 h-12"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || isSending}
          size="icon" 
          className="h-12 w-12 rounded-full shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}

// Ensure the icon is imported for the empty state
import { MessageSquare } from "lucide-react";
