"use client"

import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, Plus, Save, Search, TrendingUp } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { getStoredStudents, saveStudents, useClassStudents } from '@/lib/student-store';

type TestConfig = {
  title: string;
  subject: string;
  maxMarks: number;
};

const DEFAULT_TEST: TestConfig = {
  title: 'Unit Test Series - II',
  subject: 'Math',
  maxMarks: 100,
};
const DEFAULT_CLASS = '10-A';
const CLASS_OPTIONS = ['10-A', '10-B', '10-C'];
const SUBJECT_OPTIONS = ['Math', 'Science', 'English', 'Social Studies', 'Hindi'];

export default function TeacherMarks() {
  const [selectedClass, setSelectedClass] = useState(DEFAULT_CLASS);
  const students = useClassStudents(selectedClass);
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [draftMarks, setDraftMarks] = useState<Record<string, string>>({});
  const [testConfig, setTestConfig] = useState<TestConfig>(DEFAULT_TEST);
  const [draftTestConfig, setDraftTestConfig] = useState<TestConfig>(DEFAULT_TEST);
  const [isNewTestOpen, setIsNewTestOpen] = useState(false);

  useEffect(() => {
    setDraftMarks((prev) =>
      Object.fromEntries(
        students.map((student) => {
          const subjectScore = student.marks.find((mark) => mark.subject === testConfig.subject)?.score ?? 0;
          return [student.id, prev[student.id] ?? String(subjectScore)];
        })
      )
    );
  }, [students, testConfig.subject]);

  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();
    return query === ''
      ? true
      : student.name.toLowerCase().includes(query) || student.id.includes(query);
  });

  const evaluatedCount = useMemo(
    () => students.filter((student) => Number(draftMarks[student.id] ?? 0) > 0).length,
    [draftMarks, students]
  );
  const pendingCount = Math.max(students.length - evaluatedCount, 0);

  const scores = students
    .map((student) => Number(draftMarks[student.id] ?? 0))
    .filter((score) => !Number.isNaN(score));
  const classAverage = scores.length > 0
    ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)
    : '0.0';
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const aboveNinety = scores.filter((score) => score >= 90).length;

  const handleMarkChange = (studentId: string, value: string) => {
    if (value === '') {
      setDraftMarks((prev) => ({ ...prev, [studentId]: '' }));
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }

    const boundedValue = Math.min(Math.max(parsed, 0), testConfig.maxMarks);
    setDraftMarks((prev) => ({ ...prev, [studentId]: String(boundedValue) }));
  };

  const handleSaveAll = () => {
    const allStudents = getStoredStudents();
    const nextStudents = allStudents.map((student) => {
      if (student.class !== selectedClass) {
        return student;
      }

      const score = Number(draftMarks[student.id] ?? 0);
      const nextMark = {
        subject: testConfig.subject,
        score: Number.isNaN(score) ? 0 : score,
      };
      const otherMarks = student.marks.filter((mark) => mark.subject !== testConfig.subject);

      return {
        ...student,
        marks: [...otherMarks, nextMark],
      };
    });

    saveStudents(nextStudents);
    toast({
      title: 'Marks saved',
      description: `${testConfig.subject} scores were updated for Grade ${selectedClass}.`,
    });
  };

  const openNewTestDialog = () => {
    setDraftTestConfig(testConfig);
    setIsNewTestOpen(true);
  };

  const handleCreateTest = () => {
    setTestConfig({
      title: draftTestConfig.title.trim() || DEFAULT_TEST.title,
      subject: draftTestConfig.subject.trim() || DEFAULT_TEST.subject,
      maxMarks: draftTestConfig.maxMarks > 0 ? draftTestConfig.maxMarks : DEFAULT_TEST.maxMarks,
    });
    setIsNewTestOpen(false);
    toast({
      title: 'Test updated',
      description: 'You can now enter marks for the selected test.',
    });
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Academic Evaluation</h2>
            <p className="text-muted-foreground">Record and manage student performance for Grade {selectedClass}.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openNewTestDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Test
            </Button>
            <Button className="bg-accent" onClick={handleSaveAll}>
              <Save className="mr-2 h-4 w-4" /> Save All
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student name..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
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
          <Select
            value={testConfig.subject}
            onValueChange={(subject) => setTestConfig((prev) => ({ ...prev, subject }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_OPTIONS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  Subject: {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-lg">{testConfig.title}</CardTitle>
                <CardDescription>{testConfig.subject} (Max Marks: {testConfig.maxMarks})</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold">Pending: {pendingCount} Students</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Current Grade</TableHead>
                  <TableHead className="w-[150px]">Enter Marks</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const score = Number(draftMarks[student.id] ?? 0);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.id}</TableCell>
                      <TableCell className="font-bold text-sm">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{score}%</span>
                          <TrendingUp className="h-3 w-3 text-accent" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={draftMarks[student.id] ?? '0'}
                          onChange={(event) => handleMarkChange(student.id, event.target.value)}
                          className="h-8 w-24 font-bold"
                          min={0}
                          max={testConfig.maxMarks}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={score > 0 ? "default" : "outline"} className={score > 0 ? "bg-accent" : ""}>
                          {score > 0 ? "Evaluated" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Class Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Class Average</span>
                <span className="font-bold text-primary text-lg">{classAverage}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Highest Score</span>
                <span className="font-bold text-accent text-lg">{highestScore}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Students above 90%</span>
                <span className="font-bold text-orange-500 text-lg">{aboveNinety}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                After saving these marks, you can trigger the AI Insights tool on the Home screen to identify students who might need extra attention before the final exams.
              </p>
              <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary">Download Progress Report PDF</Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isNewTestOpen} onOpenChange={setIsNewTestOpen}>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>New Test</DialogTitle>
              <DialogDescription>
                Set the test name, subject, and maximum marks before entering scores.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="test-title">Test Title</Label>
                <Input
                  id="test-title"
                  value={draftTestConfig.title}
                  onChange={(event) => setDraftTestConfig((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Unit Test Series - III"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="test-subject">Subject</Label>
                <Select
                  value={draftTestConfig.subject}
                  onValueChange={(subject) => setDraftTestConfig((prev) => ({ ...prev, subject }))}
                >
                  <SelectTrigger id="test-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_OPTIONS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max-marks">Max Marks</Label>
                <Input
                  id="max-marks"
                  type="number"
                  value={draftTestConfig.maxMarks}
                  onChange={(event) => setDraftTestConfig((prev) => ({ ...prev, maxMarks: Number(event.target.value) || 0 }))}
                  min={1}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewTestOpen(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={handleCreateTest}>Use Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
