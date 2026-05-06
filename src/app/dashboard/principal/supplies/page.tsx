"use client"

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Shirt, Package, Truck, CheckCircle2, AlertCircle, Loader2, MessageSquare, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getStoredSupplyRequests, saveSupplyRequests, subscribeSupplyRequests, SupplyRequest } from '@/lib/supply-request-store';

export default function PrincipalSupplies() {
  const { toast } = useToast();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>(() => getStoredSupplyRequests().filter((request) => request.target === 'Uniforms & Books Section'));

  useEffect(() => {
    const unsubscribe = subscribeSupplyRequests(() => {
      setSupplyRequests(getStoredSupplyRequests().filter((request) => request.target === 'Uniforms & Books Section'));
    });

    return unsubscribe;
  }, []);

  const supplies = [
    { title: 'Textbook Sets', distributed: 412, target: 450, icon: BookOpen, color: 'text-primary' },
    { title: 'School Uniforms', distributed: 385, target: 450, icon: Shirt, color: 'text-accent' },
    { title: 'Stationary Kits', distributed: 445, target: 450, icon: Package, color: 'text-orange-500' },
  ];

  const handleRequestSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const item = formData.get('item');
    const quantity = formData.get('qty');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRequestOpen(false);
      toast({
        title: "Replenishment Requested",
        description: `Order for ${quantity} units of ${item} has been sent to the district logistics hub.`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout role="principal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Supplies & Logistics</h2>
            <p className="text-muted-foreground">Track distribution of books, uniforms, and classroom materials.</p>
          </div>
          <Button className="bg-accent" onClick={() => setIsRequestOpen(true)}>
            <Truck className="mr-2 h-4 w-4" /> Request Replenishment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supplies.map((item, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-muted ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="font-bold text-xs">
                    {Math.round((item.distributed / item.target) * 100)}% Fulfilled
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground">{item.title}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold">{item.distributed}</p>
                    <p className="text-xs text-muted-foreground font-medium">Total Need: {item.target}</p>
                  </div>
                  <Progress value={(item.distributed / item.target) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Teacher Requests for Uniforms & Books</CardTitle>
            <CardDescription>Requests submitted by teachers routed to your section.</CardDescription>
          </CardHeader>
          <CardContent>
            {supplyRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending teacher requests in this section yet.</p>
            ) : (
              <div className="space-y-3">
                {supplyRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-border p-4 bg-secondary/5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold">{request.section} — {request.type === 'textbooks' ? 'Textbooks' : request.type === 'uniforms' ? 'Uniforms' : 'Stationery'}</p>
                        <p className="text-sm text-muted-foreground">Qty: {request.quantity} • Requested on {request.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{request.target}</Badge>
                        {request.forwardedToAdmin ? (
                          <Badge variant="outline" className="text-xs">
                            Forwarded on {request.forwardedDate}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    {request.reason && <p className="mt-3 text-sm text-muted-foreground">{request.reason}</p>}
                    {!request.forwardedToAdmin ? (
                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updatedRequests = getStoredSupplyRequests().map((existing) =>
                              existing.id === request.id
                                ? {
                                    ...existing,
                                    forwardedToAdmin: true,
                                    forwardedDate: new Date().toLocaleDateString(),
                                  }
                                : existing,
                            );
                            saveSupplyRequests(updatedRequests);
                            setSupplyRequests(updatedRequests.filter((item) => item.target === 'Uniforms & Books Section'));
                            toast({
                              title: 'Sent to administrator',
                              description: `${request.section} ${request.type === 'textbooks' ? 'Textbooks' : request.type === 'uniforms' ? 'Uniforms' : 'Stationery'} request has been forwarded to admin.`,
                            });
                          }}
                        >
                          Send to Administrator
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Class-wise Distribution Status</CardTitle>
            <CardDescription>Detailed breakdown of fulfillment by grade.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Books</TableHead>
                  <TableHead>Uniforms</TableHead>
                  <TableHead>Stationary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { grade: 'Grade 10-A', books: '45/45', uniforms: '42/45', station: '45/45', status: 'Almost Complete' },
                  { grade: 'Grade 10-B', books: '42/42', uniforms: '38/42', station: '42/42', status: 'Almost Complete' },
                  { grade: 'Grade 9-A', books: '48/48', uniforms: '48/48', station: '48/48', status: 'Fulfilled' },
                  { grade: 'Grade 9-B', books: '40/44', uniforms: '35/44', station: '44/44', status: 'Partial' },
                ].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold">{row.grade}</TableCell>
                    <TableCell>{row.books}</TableCell>
                    <TableCell>{row.uniforms}</TableCell>
                    <TableCell>{row.station}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'Fulfilled' ? 'default' : row.status === 'Partial' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {row.status === 'Fulfilled' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : row.status === 'Partial' ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Next Batch Expected</p>
                <p className="text-xs text-muted-foreground">25 Uniform Sets & 12 Book Kits arriving on May 20, 2024</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Track Shipment</Button>
          </CardContent>
        </Card>
      </div>

      {/* Replenishment Request Dialog */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleRequestSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-headline text-xl">
                <Plus className="h-5 w-5 text-accent" /> Request Supplies
              </DialogTitle>
              <DialogDescription>
                Submit a request for additional uniforms, textbooks, or stationary kits.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item">Supply Item</Label>
                <select 
                  id="item" 
                  name="item"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="School Uniforms">School Uniforms</option>
                  <option value="Textbook Sets">Textbook Sets</option>
                  <option value="Stationary Kits">Stationary Kits</option>
                  <option value="Science Lab Consumables">Science Lab Consumables</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">Required Quantity</Label>
                  <Input id="qty" name="qty" type="number" placeholder="50" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Urgency</Label>
                  <select id="priority" name="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="Normal">Normal</option>
                    <option value="High">High - Shortage Imminent</option>
                    <option value="Critical">Critical - Urgent Need</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea 
                    id="reason" 
                    name="reason"
                    placeholder="e.g. New enrollments or damaged stock replacement..." 
                    className="pl-10 min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsRequestOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary px-8" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Send Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
