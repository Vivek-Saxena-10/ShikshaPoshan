"use client"

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Shirt, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useClassStudents } from '@/lib/student-store';
import { getStoredSupplyRequests, saveSupplyRequests, subscribeSupplyRequests, SupplyRequest } from '@/lib/supply-request-store';

type SupplyStatus = 'distributed' | 'pending';

type StudentSupply = {
  id: string;
  name: string;
  textbooks: SupplyStatus;
  uniforms: SupplyStatus;
  stationary: SupplyStatus;
};

const createStudentSupplyRow = (student: { id: string; name: string }, index: number): StudentSupply => ({
  id: student.id,
  name: student.name,
  textbooks: index % 3 !== 0 ? 'distributed' : 'pending',
  uniforms: index % 4 !== 0 ? 'distributed' : 'pending',
  stationary: index % 5 !== 0 ? 'distributed' : 'pending',
});

export default function TeacherSupplies() {
  const { toast } = useToast();
  const students = useClassStudents('10-A');
  const [studentSupplies, setStudentSupplies] = useState<StudentSupply[]>([]);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>(() => getStoredSupplyRequests());
  const [requestType, setRequestType] = useState<'textbooks' | 'uniforms' | 'stationary'>('textbooks');
  const [requestClass, setRequestClass] = useState('10-A');
  const [requestQuantity, setRequestQuantity] = useState('1');
  const [requestReason, setRequestReason] = useState('');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentSupply | null>(null);
  const [selectedSupply, setSelectedSupply] = useState<'textbooks' | 'uniforms' | 'stationary' | ''>('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeSupplyRequests(() => {
      setSupplyRequests(getStoredSupplyRequests());
    });

    return unsubscribe;
  }, []);

  const classStrength = students.length;
  const subjectOptions = ['Math', 'Science', 'English', 'Social Studies', 'Hindi'];

  useEffect(() => {
    const initialRows = students.map(createStudentSupplyRow);
    const hasSameStudents = studentSupplies.length === students.length && students.every((student, index) => studentSupplies[index]?.id === student.id);
    if (hasSameStudents && studentSupplies.length > 0) {
      return;
    }

    setStudentSupplies(initialRows);
  }, [students, studentSupplies]);

  const openEditDialog = (row: StudentSupply) => {
    setEditingStudent(row);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStudent) {
      return;
    }

    setStudentSupplies((prev) => prev.map((row) => row.id === editingStudent.id ? editingStudent : row));
    setIsEditOpen(false);
  };

  const getTargetSection = (type: string) =>
    type === 'stationary' ? 'Stationery Section' : 'Uniforms & Books Section';

  const submitSupplyRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quantity = Number(requestQuantity);
    if (!requestType || quantity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid request',
        description: 'Please select a valid item and quantity.',
      });
      return;
    }

    const newRequest: SupplyRequest = {
      id: `${Date.now()}`,
      type: requestType,
      quantity,
      section: requestClass,
      reason: requestReason,
      target: getTargetSection(requestType),
      date: new Date().toLocaleDateString(),
    };

    setSupplyRequests((prev) => {
      const updated = [newRequest, ...prev];
      saveSupplyRequests(updated);
      return updated;
    });

    setRequestReason('');
    setRequestQuantity('1');
    setRequestType('textbooks');

    toast({
      title: 'Request submitted',
      description: `Sent to ${newRequest.target} for ${newRequest.type}.`,
    });
  };

  const logDistribution = () => {
    if (!selectedSupply || Number(quantity) <= 0) {
      setIsLogOpen(false);
      setSelectedSupply('');
      setSelectedSubject('');
      setQuantity('');
      return;
    }

    const amount = Number(quantity);
    setStudentSupplies((prev) => {
      const currentDistributed = prev.filter((row) => row[selectedSupply] === 'distributed').length;
      const targetDistributed = Math.min(classStrength, currentDistributed + amount);
      let distributedCount = 0;

      return prev.map((row) => {
        if (row[selectedSupply] === 'distributed') {
          distributedCount += 1;
          return row;
        }

        if (distributedCount < targetDistributed) {
          distributedCount += 1;
          return { ...row, [selectedSupply]: 'distributed' };
        }

        return row;
      });
    });

    setIsLogOpen(false);
    setSelectedSupply('');
    setSelectedSubject('');
    setQuantity('');
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Classroom Logistics</h2>
          <p className="text-muted-foreground">Request supplies for your class and track current textbook, uniform, and stationary counts.</p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <div>
                <CardTitle className="font-headline text-lg">Request Supplies</CardTitle>
                <CardDescription>Send a requisition to the relevant principal sections for uniforms, books, or stationery.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitSupplyRequest}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select value={requestType} onValueChange={(value) => setRequestType(value as 'textbooks' | 'uniforms' | 'stationary')}>
                      <SelectTrigger id="requestType">
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="textbooks">Textbooks</SelectItem>
                        <SelectItem value="uniforms">Uniforms</SelectItem>
                        <SelectItem value="stationary">Stationery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestClass">Class Section</Label>
                    <Input
                      id="requestClass"
                      value={requestClass}
                      onChange={(e) => setRequestClass(e.target.value)}
                      placeholder="e.g. 10-A"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestQuantity">Quantity</Label>
                    <Input
                      id="requestQuantity"
                      type="number"
                      min={1}
                      value={requestQuantity}
                      onChange={(e) => setRequestQuantity(e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestReason">Reason / Notes</Label>
                  <Input
                    id="requestReason"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="Provide a short justification"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Requests for textbooks and uniforms are routed to the Uniforms & Books Section. Stationery requests are routed to the Stationery Section.
                  </div>
                  <Button type="submit" className="bg-primary">
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>

            {supplyRequests.length > 0 ? (
              <CardContent className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">Recent Requests</p>
                  <Badge variant="outline">{supplyRequests.length} total</Badge>
                </div>
                <div className="space-y-3">
                  {supplyRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="rounded-2xl border border-border p-4 bg-secondary/10">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold">{request.type === 'stationary' ? 'Stationery' : request.type === 'uniforms' ? 'Uniforms' : 'Textbooks'}</p>
                        <Badge variant="outline">{request.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Qty: {request.quantity}</p>
                      <p className="text-sm text-muted-foreground">Route: {request.target}</p>
                      {request.reason && <p className="text-sm mt-2">"{request.reason}"</p>}
                    </div>
                  ))}
                  {supplyRequests.length > 3 && (
                    <p className="text-xs text-muted-foreground">Showing the latest 3 requests.</p>
                  )}
                </div>
              </CardContent>
            ) : null}
          </Card>
        </div>

        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="font-headline text-lg">Detailed Item Tracking</CardTitle>
              <CardDescription>Status per student for the current academic session.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center">Textbooks</TableHead>
                  <TableHead className="text-center">Uniforms</TableHead>
                  <TableHead className="text-center">Stationary</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentSupplies.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs font-bold">{row.id}</TableCell>
                    <TableCell className="text-sm font-medium">{row.name}</TableCell>
                    {[row.textbooks, row.uniforms, row.stationary].map((status, index) => (
                      <TableCell key={index} className="text-center">
                        <div className="flex justify-center">
                          {status === 'distributed' ? (
                            <div className="p-1 rounded-full bg-accent/10">
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                            </div>
                          ) : (
                            <div className="p-1 rounded-full bg-orange-100">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log New Distribution</DialogTitle>
              <DialogDescription>
                Record the distribution of supplies to students in your class.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supply" className="text-right">
                  Supply Type
                </Label>
                <Select
                  value={selectedSupply}
                  onValueChange={(value) => {
                    setSelectedSupply(value as 'textbooks' | 'uniforms' | 'stationary' | '');
                    if (value !== 'textbooks') {
                      setSelectedSubject('');
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select supply type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textbooks">Textbook Sets</SelectItem>
                    <SelectItem value="uniforms">School Uniforms</SelectItem>
                    <SelectItem value="stationary">Stationary Kits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedSupply === 'textbooks' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select textbook subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={logDistribution}>
                Log Distribution
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Supply Status</DialogTitle>
              <DialogDescription>Adjust supply distribution for the selected student.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="textbooks" className="text-right">Textbooks</Label>
                <Select
                  value={editingStudent?.textbooks ?? 'pending'}
                  onValueChange={(value) => setEditingStudent((prev) => prev ? { ...prev, textbooks: value as SupplyStatus } : prev)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Textbook status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributed">Distributed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uniforms" className="text-right">Uniforms</Label>
                <Select
                  value={editingStudent?.uniforms ?? 'pending'}
                  onValueChange={(value) => setEditingStudent((prev) => prev ? { ...prev, uniforms: value as SupplyStatus } : prev)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Uniform status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributed">Distributed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stationary" className="text-right">Stationary</Label>
                <Select
                  value={editingStudent?.stationary ?? 'pending'}
                  onValueChange={(value) => setEditingStudent((prev) => prev ? { ...prev, stationary: value as SupplyStatus } : prev)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Stationary status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributed">Distributed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={!editingStudent}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
