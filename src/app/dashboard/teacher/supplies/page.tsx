"use client"

import { useState } from 'react';
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
} from "@/components/ui/dialog";
import { useClassStudents } from '@/lib/student-store';

export default function TeacherSupplies() {
  const students = useClassStudents('10-A');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quantity, setQuantity] = useState('');
  const classStrength = students.length;
  const subjectOptions = ['Math', 'Science', 'English', 'Social Studies', 'Hindi'];
  const supplies = [
    { title: 'Textbook Sets', distributed: classStrength, target: classStrength, icon: BookOpen, color: 'text-primary' },
    { title: 'School Uniforms', distributed: Math.max(classStrength - 2, 0), target: classStrength, icon: Shirt, color: 'text-accent' },
    { title: 'Stationary Kits', distributed: Math.max(classStrength - 1, 0), target: classStrength, icon: Package, color: 'text-orange-500' },
  ];

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Classroom Logistics</h2>
            <p className="text-muted-foreground">Distribution tracking for Grade 10-A supplies.</p>
          </div>
          <Button className="bg-accent" onClick={() => {
            setSelectedSupply('');
            setSelectedSubject('');
            setQuantity('');
            setIsLogOpen(true);
          }}>
            <Truck className="mr-2 h-4 w-4" /> Log New Distribution
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supplies.map((item, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-muted ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <Badge variant={item.distributed === item.target ? "default" : "outline"} className={item.distributed === item.target ? "bg-accent" : "text-orange-500 border-orange-500"}>
                    {item.target > 0 ? Math.round((item.distributed / item.target) * 100) : 0}% Fulfilled
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground">{item.title}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold">{item.distributed}</p>
                    <p className="text-xs text-muted-foreground font-medium">Class Strength: {item.target}</p>
                  </div>
                  <Progress value={item.target > 0 ? (item.distributed / item.target) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, i) => {
                  // Mocking distribution status for visual variety
                  const hasUniform = i % 4 !== 0;
                  const hasStationary = i % 8 !== 0;
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs font-bold">{student.id}</TableCell>
                      <TableCell className="text-sm font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <div className="p-1 rounded-full bg-accent/10">
                             <CheckCircle2 className="h-4 w-4 text-accent" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {hasUniform ? (
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
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {hasStationary ? (
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
                    </TableRow>
                  );
                })}
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
                    setSelectedSupply(value);
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // TODO: Implement logging logic
                console.log('Logging distribution:', { selectedSupply, selectedSubject, quantity });
                setIsLogOpen(false);
                setSelectedSupply('');
                setSelectedSubject('');
                setQuantity('');
              }}>
                Log Distribution
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
