"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Phone, MoreVertical, MessageSquare, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useSession } from "next-auth/react";

export default function CustomerMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const { data: session } = useSession();
  const lang = useLanguage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    title: lang === "en" ? "Messages" : "বার্তা",
    search: lang === "en" ? "Search conversations..." : "কথোপকথন খুঁজুন...",
    type: lang === "en" ? "Type a message..." : "একটি বার্তা টাইপ করুন...",
    selectConvo: lang === "en" ? "Select a conversation to start messaging" : "বার্তা পাঠাতে একটি কথোপকথন নির্বাচন করুন"
  };

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchMessages = useCallback(async (bookingId: string) => {
    try {
      const res = await fetch(`/api/messages?bookingId=${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConvo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMessages(selectedConvo);
      const interval = setInterval(() => fetchMessages(selectedConvo), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConvo, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvo || !session?.user) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedConvo, content: messageText })
      });
      if (res.ok) {
        setMessageText("");
        fetchMessages(selectedConvo);
        fetchConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeConvoData = conversations.find(c => c.id === selectedConvo);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" /> {t.title}
        </h1>
      </div>

      <div className="flex-1 bg-card/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-primary/5 flex overflow-hidden">
        
        {/* Sidebar (Conversations List) */}
        <div className={`w-full md:w-1/3 border-r flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t.search}
                className="pl-9 h-11 bg-muted/50 rounded-xl focus:bg-background transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            {conversations.map((convo) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                className={`p-3 sm:p-4 rounded-2xl cursor-pointer flex gap-4 items-center mb-1 transition-colors ${
                  selectedConvo === convo.id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm">
                    <img src={convo.image} alt={convo.name} className="w-full h-full object-cover" />
                  </div>
                  {convo.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm truncate pr-2">{convo.name}</h4>
                    <span className="text-[10px] font-medium text-muted-foreground shrink-0">{convo.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-xs truncate text-muted-foreground`}>
                      {convo.lastMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-muted/10 relative ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b bg-background/50 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setSelectedConvo(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <img src={activeConvoData?.image} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold">{activeConvoData?.name}</h3>
                      <p className="text-xs text-green-600 font-medium">Online</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full shadow-sm"><Phone className="w-4 h-4 text-primary" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5 text-muted-foreground" /></Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === session?.user?.id;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-background border rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t bg-background/50 backdrop-blur-md">
                <form 
                  onSubmit={sendMessage}
                  className="flex gap-2 items-center"
                >
                  <Input 
                    placeholder={t.type}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 h-12 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary px-6"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-12 w-12 rounded-full shrink-0 shadow-md shadow-primary/20" 
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center h-full">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium">{t.selectConvo}</p>
              <p className="text-sm mt-2 max-w-sm">Connect with your helpers instantly to coordinate tasks and track progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
