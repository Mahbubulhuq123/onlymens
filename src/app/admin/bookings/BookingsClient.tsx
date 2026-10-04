"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Eye, XCircle, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BookingsClient({ initialBookings }: { initialBookings: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState(initialBookings);

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.helper?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SEARCHING': return 'bg-orange-100 text-orange-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'HELPER_ON_THE_WAY': return 'bg-indigo-100 text-indigo-800';
      case 'ARRIVED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-blue-500 text-white';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'DISPUTED': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">Booking Management</h1>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, customer, helper, service..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Helper</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id.slice(-8)}</TableCell>
                    <TableCell className="font-medium">{b.service?.name}</TableCell>
                    <TableCell>{b.customer?.name || "Unknown"}</TableCell>
                    <TableCell>
                      {b.helper ? (
                        <span className="flex items-center gap-2">
                          <img src={b.helper.image || `https://i.pravatar.cc/150?u=${b.helper.email}`} alt="" className="w-6 h-6 rounded-full" />
                          {b.helper.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(b.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">৳{b.finalPrice || b.estimatedPrice}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {['PENDING', 'SEARCHING', 'ACCEPTED'].includes(b.status) && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
