"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Phone, MapPin, Mail, ShieldCheck, Loader2, Save, Camera } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");

  const lang = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/customer/profile")
      .then(res => {
        if(res.status === 401) router.push("/login");
        return res.json();
      })
      .then(data => {
        if(data && !data.error) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.customerProfile?.phone || "");
          setAddress(data.customerProfile?.address || "");
          setImage(data.image || "");
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address })
      });
      
      if(res.ok) {
        setMessage({ type: "success", text: lang === "en" ? "Profile updated successfully!" : "প্রোফাইল সফলভাবে আপডেট হয়েছে!" });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      setMessage({ type: "error", text: lang === "en" ? "An error occurred." : "একটি ত্রুটি ঘটেছে।" });
    } finally {
      setIsSaving(false);
    }
  };

  const t = {
    title: lang === "en" ? "My Profile" : "আমার প্রোফাইল",
    subtitle: lang === "en" ? "Manage your personal information." : "আপনার ব্যক্তিগত তথ্য পরিচালনা করুন।",
    personalInfo: lang === "en" ? "Personal Information" : "ব্যক্তিগত তথ্য",
    name: lang === "en" ? "Full Name" : "পুরো নাম",
    email: lang === "en" ? "Email Address" : "ইমেইল ঠিকানা",
    phone: lang === "en" ? "Phone Number" : "ফোন নম্বর",
    address: lang === "en" ? "Default Address" : "ডিফল্ট ঠিকানা",
    save: lang === "en" ? "Save Changes" : "পরিবর্তন সংরক্ষণ করুন",
    memberSince: lang === "en" ? "Verified Customer" : "যাচাইকৃত গ্রাহক"
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <div className="bg-card/50 backdrop-blur-md border rounded-3xl p-6 text-center shadow-lg shadow-primary/5">
            <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
              <div className="w-full h-full rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-6 text-muted-foreground/50" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-xl">{name || "User"}</h3>
            <div className="flex items-center justify-center gap-1 text-sm text-green-600 font-medium mt-1 mb-6 bg-green-500/10 w-max mx-auto px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" /> {t.memberSince}
            </div>
            
            <div className="h-px bg-border w-full mb-6" />
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{email || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{phone || "Not set"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Edit Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="bg-card/80 backdrop-blur-md border rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> {t.personalInfo}
            </h2>
            
            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-500/20' : 'bg-red-500/10 text-red-700 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.name}</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="h-12 rounded-xl bg-muted/50 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t.email} <span className="text-xs text-muted-foreground font-normal">(Read Only)</span></label>
                  <Input 
                    value={email} 
                    disabled
                    className="h-12 rounded-xl bg-muted/50 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="h-12 rounded-xl pl-10 bg-muted/50 focus:bg-background transition-colors"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">{t.address}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full min-h-[100px] rounded-xl pl-10 pr-4 py-3 bg-muted/50 focus:bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                    placeholder="Enter your default task location"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-12 px-8 rounded-xl">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  {t.save}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
