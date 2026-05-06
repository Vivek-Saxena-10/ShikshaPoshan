"use client"

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, Mail, Phone, Plus, Search, MoreVertical, Star, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const INITIAL_TEACHERS = [
  { id: 'T1', name: 'Mr. Rajesh Kumar', subject: 'Mathematics', classes: '10A, 10B', experience: '12 Years', rating: 4.8, status: 'Present' },
  { id: 'T2', name: 'Mrs. Sunita Sharma', subject: 'Science', classes: '9A, 9C', experience: '8 Years', rating: 4.5, status: 'Present' },
  { id: 'T3', name: 'Mr. Amit Kapoor', subject: 'English', classes: '10A, 8B', experience: '15 Years', rating: 4.9, status: 'On Leave' },
  { id: 'T4', name: 'Ms. Priya Verma', subject: 'Social Studies', classes: '7A, 7B', experience: '4 Years', rating: 4.2, status: 'Present' },
  { id: 'T5', name: 'Mr. Vikram Singh', subject: 'Physical Ed', classes: 'All Grades', experience: '6 Years', rating: 4.6, status: 'Present' },
];

export default function PrincipalTeachers() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const exp = formData.get('experience') as string;
    const classes = formData.get('classes') as string;
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    const newTeacher = {
      id: `T${teachers.length + 1}`,
      name,
      subject,
      classes,
      experience: `${exp} Years`,
      rating: 5.0,
      status: 'Present',
      email,
      password,
    };

    // Simulate network latency
    setTimeout(() => {
      setTeachers(prev => [newTeacher, ...prev]);
      setIsSubmitting(false);
      setIsAddOpen(false);
      toast({
        title: "Teacher Added",
        description: `${name} has been successfully added to the faculty directory.`,
      });
    }, 1000);
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="principal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Teacher Directory</h2>
            <p className="text-muted-foreground">Manage academic staff profiles and performance.</p>
          </div>
          <Button className="bg-primary" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search teachers by name or subject..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter Departments</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Primary Subject</TableHead>
                  <TableHead>Assigned Classes</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://picsum.photos/seed/${teacher.id}/40/40`} />
                          <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{teacher.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{teacher.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{teacher.subject}</TableCell>
                    <TableCell className="text-sm">{teacher.classes}</TableCell>
                    <TableCell className="text-sm">{teacher.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold">{teacher.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === 'Present' ? 'outline' : 'secondary'} className={teacher.status === 'Present' ? 'text-accent border-accent' : ''}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No teachers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-headline">Contact Shortcuts</CardTitle>
              <CardDescription>Quickly reach out to department heads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { dept: 'Mathematics', head: 'Mr. Rajesh Kumar', email: 'math.head@school.gov' },
                { dept: 'Science', head: 'Mrs. Sunita Sharma', email: 'science.head@school.gov' },
              ].map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-secondary/20">
                  <div>
                    <p className="text-xs font-bold text-primary">{contact.dept} Head</p>
                    <p className="text-sm font-medium">{contact.head}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Mail className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Phone className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-headline">Performance Overview</CardTitle>
              <CardDescription>Aggregate faculty engagement metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Peer Rating</span>
                <span className="font-bold text-accent">4.7 / 5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Staff Attendance (MTD)</span>
                <span className="font-bold text-primary">96.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Training Hours Logged</span>
                <span className="font-bold text-orange-500">124 hrs</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddTeacher}>
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">Register New Faculty</DialogTitle>
              <DialogDescription>
                Add a new teacher to the official school directory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="e.g. Dr. Kavita Rao" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Primary Subject</Label>
                  <Input id="subject" name="subject" placeholder="e.g. Science" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" name="experience" type="number" placeholder="5" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classes">Assigned Classes</Label>
                <Input id="classes" name="classes" placeholder="e.g. 10A, 11C, 12B" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@school.gov" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create login password" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                  </>
                ) : (
                  'Confirm Registration'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
