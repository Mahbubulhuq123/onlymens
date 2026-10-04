"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, ShieldAlert, UserCheck, ShieldBan, MoreVertical } from "lucide-react";
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

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">User Management</h1>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0 border">
                        <img src={user.image || `https://i.pravatar.cc/150?u=${user.id}`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      {user.name || "Unnamed User"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'HELPER' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {user.role === 'CUSTOMER' ? user._count.bookingsAsCustomer : user._count.bookingsAsHelper}
                    </TableCell>
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
                            <UserCheck className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <ShieldBan className="mr-2 h-4 w-4" /> Suspend User
                          </DropdownMenuItem>
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
