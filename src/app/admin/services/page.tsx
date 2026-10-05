"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Edit, Trash, Settings, ShieldAlert, ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  icon: string | null;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [icon, setIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (res.ok) {
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, basePrice, icon }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create service");
      }

      // Reset form & refetch
      setName("");
      setDescription("");
      setBasePrice("");
      setIcon("");
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? It may break existing bookings.")) return;
    
    try {
      const res = await fetch(`/api/services?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      } else {
        alert("Failed to delete service.");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full shrink-0"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight">Service Management</h1>
            </div>
            <p className="text-muted-foreground ml-12">Configure the offerings available on the platform.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Service Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 sticky top-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> New Service
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20 font-medium">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Virtual Assistant"
                    className="w-full px-4 h-12 bg-muted/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background rounded-xl outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Base Price (৳)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 500"
                    className="w-full px-4 h-12 bg-muted/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background rounded-xl outline-none transition-all"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full px-4 py-3 bg-muted/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background rounded-xl outline-none transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
                    <span>Icon name</span>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">Lucide React</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ShoppingBag"
                    className="w-full px-4 h-12 bg-muted/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background rounded-xl outline-none transition-all"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 font-bold mt-2" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Publish Service"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Services List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-card/60 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 min-h-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="bg-primary/10 text-primary p-2 rounded-xl"><Layers className="w-6 h-6" /></span> Active Services
                </h2>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground">{services.length} Total</span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
                  <Layers className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-1">No services yet</h3>
                  <p className="text-muted-foreground">Create your first service from the left panel.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {services.map((svc) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={svc.id} 
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-background/80 border hover:border-primary/50 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors" />
                        <div className="pl-2 w-full pr-4 mb-4 sm:mb-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-extrabold text-lg text-foreground">{svc.name}</h4>
                            <span className="font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">৳{svc.basePrice}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{svc.description || "No description provided."}</p>
                          {svc.icon && (
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-3 flex items-center gap-1">
                              Icon: <span className="text-foreground">{svc.icon}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl h-10 border-primary/20 text-primary hover:bg-primary/5">
                            <Edit className="w-4 h-4 mr-2 sm:mr-0" /> <span className="sm:hidden">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(svc.id)} className="flex-1 sm:flex-none rounded-xl h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Trash className="w-4 h-4 mr-2 sm:mr-0" /> <span className="sm:hidden">Delete</span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
