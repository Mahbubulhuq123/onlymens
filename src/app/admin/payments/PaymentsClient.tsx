"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, CreditCard, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export function PaymentsClient({ initialPayments }: { initialPayments: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = initialPayments.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.booking?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">Payment Ledger</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">
                ৳{initialPayments.filter(p => p.status === 'COMPLETED').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search ID or Customer..." 
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
                <TableHead>Payment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id.slice(-8)}</TableCell>
                    <TableCell>{format(new Date(p.createdAt), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell className="font-medium">{p.booking?.customer?.name}</TableCell>
                    <TableCell>{p.booking?.service?.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {p.method}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">৳{p.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        p.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status}
                      </span>
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
