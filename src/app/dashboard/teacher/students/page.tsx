"use client"

import { useMemo, useState } from 'react';
import { FileText, Mail, MoreVertical, Phone, Plus, Search, Users } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/lib/db';
import { addStudent, getNextStudentId, getStoredStudents, useClassStudents } from '@/lib/student-store';

const DEFAULT_CLASS = '10-A';
const CLASS_OPTIONS = ['10-A', '10-B', '10-C'];

type StudentFormState = {
  className: string;
  gender: 'male' | 'female' | 'other';
  id: string;
  name: string;
};

const emptyForm = (): StudentFormState => ({
  className: DEFAULT_CLASS,
  gender: 'male',
  id: '',
  name: '',
});

export default function TeacherStudents() {
  const [selectedClass, setSelectedClass] = useState(DEFAULT_CLASS);
  const students = useClassStudents(selectedClass);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<StudentFormState>(emptyForm());
  const boysCount = students.filter((student) => student.gender === 'male').length;
  const girlsCount = students.filter((student) => student.gender === 'female').length;
  const otherCount = students.filter((student) => student.gender === 'other').length;

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) =>
      query === ''
        ? true
        : student.name.toLowerCase().includes(query) || student.id.includes(query)
    );
  }, [search, students]);

  const openAddDialog = () => {
    setForm({
      ...emptyForm(),
      className: selectedClass,
    });
    setIsAddOpen(true);
  };

  const handleAddStudent = () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      return;
    }

    const allStudents = getStoredStudents();
    const nextId = form.id.trim() || getNextStudentId(allStudents);
    if (allStudents.some((student) => student.id === nextId)) {
      return;
    }

    const newStudent: Student = {
      id: nextId,
      name: trimmedName,
      class: form.className,
      gender: form.gender,
      schoolId: '1',
      attendance: [],
      marks: [],
    };

    addStudent(newStudent);
    setIsAddOpen(false);
    setForm(emptyForm());
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Student Directory</h2>
            <p className="text-muted-foreground">Class list and detailed student records for Grade {selectedClass}.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
            <Button className="bg-primary"><FileText className="mr-2 h-4 w-4" /> Export Class List</Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or roll number..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((className) => (
                <SelectItem key={className} value={className}>
                  Grade {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Roll No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://picsum.photos/seed/${student.id}/40/40`} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary">{student.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{student.class}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">Mrs. Sharma</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-accent border-accent bg-accent/5">Regular</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-accent uppercase">Gender Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">
                  {boysCount} Boys / {girlsCount} Girls{otherCount > 0 ? ` / ${otherCount} Other` : ''}
                </p>
                <Users className="h-8 w-8 text-accent opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-primary uppercase">CWSN Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">2 Students</p>
                <Users className="h-8 w-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-orange-600 uppercase">Total Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{students.length} / 50 Capacity</p>
                <Users className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                New students are saved class-wise and automatically appear in every tab for that class.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student-id">Roll Number</Label>
                <Input
                  id="student-id"
                  value={form.id}
                  onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                  placeholder="Leave blank to auto-generate"
                />
              </div>

              <div className="grid gap-2">
                <Label>Class</Label>
                <Select
                  value={form.className}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, className: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((className) => (
                      <SelectItem key={className} value={className}>
                        Grade {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(value: 'male' | 'female' | 'other') => setForm((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={handleAddStudent} disabled={form.name.trim() === ''}>
                Save Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
