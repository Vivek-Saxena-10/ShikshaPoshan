"use client"

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, UserCheck, ArrowRight, BarChart3, Clock, Mail, Phone, GraduationCap, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useToast } from '@/hooks/use-toast';

const INITIAL_CLASSES_DATA = [
  { 
    id: '10A', 
    name: 'Grade 10-A', 
    teacher: 'Mr. Rajesh', 
    email: 'rajesh.math@school.gov',
    phone: '+91 98765 00001',
    students: 45, 
    attendance: 92, 
    status: 'Active',
    subjects: [
      { name: 'Mathematics', avg: 84 },
      { name: 'Science', avg: 78 },
      { name: 'English', avg: 88 },
      { name: 'Social Studies', avg: 72 }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 8 },
      { grade: 'A', count: 12 },
      { grade: 'B', count: 15 },
      { grade: 'C', count: 7 },
      { grade: 'D', count: 3 }
    ]
  },
  { 
    id: '10B', 
    name: 'Grade 10-B', 
    teacher: 'Mrs. Sharma', 
    email: 'sharma.sci@school.gov',
    phone: '+91 98765 00002',
    students: 42, 
    attendance: 88, 
    status: 'Active',
    subjects: [
      { name: 'Mathematics', avg: 76 },
      { name: 'Science', avg: 82 },
      { name: 'English', avg: 85 },
      { name: 'Social Studies', avg: 79 }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 5 },
      { grade: 'A', count: 10 },
      { grade: 'B', count: 18 },
      { grade: 'C', count: 6 },
      { grade: 'D', count: 3 }
    ]
  },
  { 
    id: '9A', 
    name: 'Grade 9-A', 
    teacher: 'Mr. Kapoor', 
    email: 'kapoor.eng@school.gov',
    phone: '+91 98765 00003',
    students: 48, 
    attendance: 95, 
    status: 'Active',
    subjects: [
      { name: 'Mathematics', avg: 81 },
      { name: 'Science', avg: 85 },
      { name: 'English', avg: 92 },
      { name: 'Social Studies', avg: 88 }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 12 },
      { grade: 'A', count: 15 },
      { grade: 'B', count: 12 },
      { grade: 'C', count: 6 },
      { grade: 'D', count: 3 }
    ]
  },
  { 
    id: '9B', 
    name: 'Grade 9-B', 
    teacher: 'Ms. Verma', 
    email: 'verma.hist@school.gov',
    phone: '+91 98765 00004',
    students: 44, 
    attendance: 91, 
    status: 'Active',
    subjects: [
      { name: 'Mathematics', avg: 72 },
      { name: 'Science', avg: 75 },
      { name: 'English', avg: 82 },
      { name: 'Social Studies', avg: 85 }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 4 },
      { grade: 'A', count: 12 },
      { grade: 'B', count: 16 },
      { grade: 'C', count: 8 },
      { grade: 'D', count: 4 }
    ]
  },
];

const chartConfig = {
  count: {
    label: "Students",
    color: "hsl(var(--primary))",
  },
};

export default function PrincipalClasses() {
  const { toast } = useToast();
  const [classes, setClasses] = useState(INITIAL_CLASSES_DATA);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  const handleViewReport = (cls: any) => {
    setSelectedClass(cls);
    setIsReportOpen(true);
  };

  const handleAddClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const className = formData.get('className') as string;
    const teacherName = formData.get('teacher') as string;
    const strength = Number(formData.get('strength'));
    
    const newClass = {
      id: Math.random().toString(36).substring(2, 9),
      name: className,
      teacher: teacherName,
      email: `${teacherName.toLowerCase().replace(/\s/g, '.')}@school.gov`,
      phone: '+91 98765 00000',
      students: strength,
      attendance: 0,
      status: 'Active',
      subjects: [
        { name: 'Mathematics', avg: 0 },
        { name: 'Science', avg: 0 },
        { name: 'English', avg: 0 },
        { name: 'Social Studies', avg: 0 }
      ],
      gradeDistribution: [
        { grade: 'A+', count: 0 },
        { grade: 'A', count: 0 },
        { grade: 'B', count: 0 },
        { grade: 'C', count: 0 },
        { grade: 'D', count: 0 }
      ]
    };

    setClasses(prev => [...prev, newClass]);
    
    toast({
      title: "Class Registered",
      description: `${className} has been added to the school directory.`,
    });
    setIsAddClassOpen(false);
  };

  return (
    <DashboardLayout role="principal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Classroom Monitoring</h2>
            <p className="text-muted-foreground">Overview of current classes, assigned teachers, and engagement metrics.</p>
          </div>
          <Button className="bg-primary" onClick={() => setIsAddClassOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Class
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-headline">{cls.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-accent border-accent">{cls.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <UserCheck className="h-3 w-3" /> Teacher:
                  </span>
                  <span className="font-bold">{cls.teacher}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Strength:
                  </span>
                  <span className="font-bold">{cls.students} Students</span>
                </div>
                
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Attendance Rate</span>
                    <span className="text-primary">{cls.attendance}%</span>
                  </div>
                  <Progress value={cls.attendance} className="h-1.5" />
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full text-primary font-bold text-xs" 
                  size="sm"
                  onClick={() => handleViewReport(cls)}
                >
                  View Detailed Report <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddClass}>
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">Register New Class</DialogTitle>
              <DialogDescription>
                Add a new grade section and assign a primary teacher.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input id="className" name="className" placeholder="e.g. Grade 11-C" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Assigned Teacher</Label>
                <Input id="teacher" name="teacher" placeholder="Enter teacher name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strength">Student Strength</Label>
                  <Input id="strength" name="strength" type="number" defaultValue="40" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsAddClassOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary">Create Section</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detailed Report Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedClass && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary text-white rounded-lg">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-headline font-bold text-primary">
                      {selectedClass.name} Performance Report
                    </DialogTitle>
                    <DialogDescription>
                      Academic year 2023-2024 • Term 2
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Top Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg Attendance</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="text-lg font-bold">{selectedClass.attendance}%</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pass Rate</p>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-accent" />
                      <p className="text-lg font-bold">98%</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Class Strength</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <p className="text-lg font-bold">{selectedClass.students}</p>
                    </div>
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Subject Proficiency
                  </h4>
                  <div className="grid gap-3">
                    {selectedClass.subjects.map((sub: any) => (
                      <div key={sub.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{sub.name}</span>
                          <span className="font-bold text-primary">{sub.avg}%</span>
                        </div>
                        <Progress value={sub.avg} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grade Distribution Chart */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Grade Distribution
                  </h4>
                  <div className="h-[200px] w-full bg-muted/20 rounded-xl border border-dashed p-4">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart data={selectedClass.gradeDistribution}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="grade" tickLine={false} axisLine={false} tickMargin={10} className="text-[10px] font-bold" />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>

                {/* Teacher Contact */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-bold mb-3">Teacher In-Charge</h4>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {selectedClass.teacher[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{selectedClass.teacher}</p>
                        <p className="text-xs text-muted-foreground">Class Teacher</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                        <Mail className="h-4 w-4 text-primary" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                        <Phone className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button className="flex-1 bg-primary">Download PDF Report</Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsReportOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
