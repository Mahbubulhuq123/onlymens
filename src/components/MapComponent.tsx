"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useLanguage } from "./language-provider";

// Dynamically import Leaflet Map to avoid SSR issues since it relies on window object
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => {
    return (
      <div className="w-full h-full bg-muted/30 rounded-2xl overflow-hidden border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-semibold text-muted-foreground">Loading interactive map...</p>
      </div>
    );
  }
});

interface MapComponentProps {
  address?: string;
  className?: string;
}

export function MapComponent(props: MapComponentProps) {
  return <LeafletMap {...props} />;
}
