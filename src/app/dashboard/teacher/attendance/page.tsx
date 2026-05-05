"use client"

import { useEffect, useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, History, Save, Settings2, Trash2, UserPlus } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/lib/db';
import { addStudent, getNextStudentId, getStoredStudents, removeStudent, useClassStudents } from '@/lib/student-store';
import { cn } from '@/lib/utils';

const HISTORY_DAYS = 30;
const CLASS_NAME = '10-A';

type HistoryDay = {
  key: string;
  shortLabel: string;
  dayLabel: string;
  fullLabel: string;
  isToday: boolean;
};

type StudentFormState = {
  id: string;
  name: string;
};

const emptyForm = (): StudentFormState => ({
  id: '',
  name: '',
});

const buildHistoryDays = (referenceDate: Date): HistoryDay[] =>
  Array.from({ length: HISTORY_DAYS }, (_, index) => {
    const date = subDays(referenceDate, HISTORY_DAYS - 1 - index);

    return {
      key: format(date, 'yyyy-MM-dd'),
      shortLabel: format(date, 'd MMM'),
      dayLabel: format(date, 'EEE'),
      fullLabel: format(date, 'MMMM d, yyyy'),
      isToday: index === HISTORY_DAYS - 1,
    };
  });

const getMockHistoricalStatus = (studentId: string, dayIndex: number) => {
  const numericId = Number.parseInt(studentId, 10) || 0;
  return (numericId * 7 + dayIndex * 3) % 11 !== 0;
};

export default function TeacherAttendance() {
  const students = useClassStudents(CLASS_NAME);
  const [mounted, setMounted] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyForm());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setAttendance((prev) =>
      Object.fromEntries(
        students.map((student) => [student.id, prev[student.id] ?? true])
      )
    );
  }, [mounted, students]);

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveAttendance = () => {
    // TODO: Implement saving to database
    console.log('Saving attendance:', attendance);
    alert('Attendance saved successfully!');
  };

  const showHistory = () => {
    setIsHistoryOpen(true);
  };

  const showManageStudents = () => {
    setStudentForm(emptyForm());
    setIsManageStudentsOpen(true);
  };

  const handleAddStudent = () => {
    const trimmedName = studentForm.name.trim();
    if (!trimmedName) {
      return;
    }

    const allStudents = getStoredStudents();
    const nextId = studentForm.id.trim() || getNextStudentId(allStudents);
    if (allStudents.some((student) => student.id === nextId)) {
      return;
    }

    const newStudent: Student = {
      id: nextId,
      name: trimmedName,
      class: CLASS_NAME,
      schoolId: '1',
      attendance: [],
      marks: [],
    };

    addStudent(newStudent);
    setStudentForm(emptyForm());
  };

  const handleRemoveStudent = (studentId: string) => {
    removeStudent(studentId);
    setAttendance((prev) => {
      const nextAttendance = { ...prev };
      delete nextAttendance[studentId];
      return nextAttendance;
    });
  };

  const todayLabel = mounted ? format(new Date(), 'MMMM d, yyyy') : 'Loading date...';
  const historyDays = mounted ? buildHistoryDays(new Date()) : [];
  const historyStartLabel = historyDays[0]?.fullLabel ?? '';
  const historyEndLabel = historyDays[historyDays.length - 1]?.fullLabel ?? '';
  const presentToday = mounted ? Object.values(attendance).filter(Boolean).length : 0;
  const averagePresent = mounted && historyDays.length > 0
    ? Math.round(
        historyDays.reduce((total, day, dayIndex) => {
          const presentCount = students.filter((student) =>
            day.isToday
              ? attendance[student.id] ?? false
              : getMockHistoricalStatus(student.id, dayIndex)
          ).length;

          return total + presentCount;
        }, 0) / historyDays.length
      )
    : 0;
  const addDisabled = studentForm.name.trim() === '';
  const duplicateId = useMemo(() => {
    const enteredId = studentForm.id.trim();
    return enteredId !== '' && students.some((student) => student.id === enteredId);
  }, [studentForm.id, students]);

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Class Attendance</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> {todayLabel}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={showManageStudents}>
              <Settings2 className="mr-2 h-4 w-4" /> Edit Student List
            </Button>
            <Button variant="outline" onClick={showHistory}>
              <History className="mr-2 h-4 w-4" /> History
            </Button>
            <Button className="bg-accent" onClick={saveAttendance}>
              <Save className="mr-2 h-4 w-4" /> Save Record
            </Button>
          </div>
        </div>

        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Daily Log - Grade 10A</CardTitle>
                <CardDescription>Mark present or absent for each student today.</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  Present: {mounted ? presentToday : '--'} / {students.length}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-xs">{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-4">
                        {!mounted ? (
                          <span className="text-muted-foreground text-xs">...</span>
                        ) : (
                          <>
                            <span className={attendance[student.id] ? "text-accent font-bold text-xs" : "text-muted-foreground text-xs"}>
                              {attendance[student.id] ? "PRESENT" : "ABSENT"}
                            </span>
                            <Checkbox
                              checked={attendance[student.id] || false}
                              onCheckedChange={() => toggleAttendance(student.id)}
                              className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isManageStudentsOpen} onOpenChange={setIsManageStudentsOpen}>
          <DialogContent className="sm:max-w-[680px]">
            <DialogHeader>
              <DialogTitle>Edit Student List</DialogTitle>
              <DialogDescription>
                Add or remove students for Grade 10-A. Changes appear across all tabs for this class.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input
                      id="student-name"
                      value={studentForm.name}
                      onChange={(event) => setStudentForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student-id">Roll Number</Label>
                    <Input
                      id="student-id"
                      value={studentForm.id}
                      onChange={(event) => setStudentForm((prev) => ({ ...prev, id: event.target.value }))}
                      placeholder="Auto if blank"
                    />
                  </div>
                  <Button className="bg-primary md:min-w-[150px]" onClick={handleAddStudent} disabled={addDisabled || duplicateId}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                </div>
                {duplicateId && (
                  <p className="mt-2 text-xs text-red-600">This roll number already exists in the class.</p>
                )}
              </div>

              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold text-primary">Current Class List</p>
                  <p className="text-xs text-muted-foreground">{students.length} students in Grade 10-A</p>
                </div>
                <ScrollArea className="h-[320px]">
                  <div className="divide-y">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{student.id}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleRemoveStudent(student.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="max-w-[96vw] sm:max-w-[96vw] lg:max-w-[92vw]">
            <DialogHeader>
              <DialogTitle>Attendance History</DialogTitle>
              <DialogDescription>
                {mounted
                  ? `Spreadsheet view for ${historyStartLabel} to ${historyEndLabel}.`
                  : 'Loading attendance history...'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold text-primary">{students.length}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Days Covered</p>
                  <p className="text-2xl font-bold text-primary">{HISTORY_DAYS}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg. Present / Day</p>
                  <p className="text-2xl font-bold text-primary">
                    {mounted ? `${averagePresent}/${students.length}` : '--'}
                  </p>
                </div>
              </div>

              <ScrollArea className="h-[65vh] rounded-lg border">
                <div className="min-w-[2200px]">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="sticky left-0 z-30 min-w-[110px] border bg-muted px-3 py-3 text-left font-semibold">
                          ID
                        </th>
                        <th className="sticky left-[110px] z-30 min-w-[220px] border bg-muted px-3 py-3 text-left font-semibold">
                          Student Name
                        </th>
                        {historyDays.map((day) => (
                          <th
                            key={day.key}
                            className={cn(
                              "min-w-[64px] border px-2 py-3 text-center text-xs font-semibold",
                              day.isToday ? "bg-primary/10 text-primary" : "bg-muted/60"
                            )}
                            title={day.fullLabel}
                          >
                            <div>{day.dayLabel}</div>
                            <div>{day.shortLabel}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="odd:bg-background even:bg-muted/10">
                          <td className="sticky left-0 z-20 border bg-inherit px-3 py-3 font-mono text-xs">
                            {student.id}
                          </td>
                          <td className="sticky left-[110px] z-20 border bg-inherit px-3 py-3 font-medium">
                            {student.name}
                          </td>
                          {historyDays.map((day, dayIndex) => {
                            const isPresent = day.isToday
                              ? attendance[student.id] ?? false
                              : getMockHistoricalStatus(student.id, dayIndex);

                            return (
                              <td
                                key={`${student.id}-${day.key}`}
                                className={cn(
                                  "border px-2 py-3 text-center text-xs font-semibold",
                                  isPresent ? "text-green-700" : "text-red-600",
                                  day.isToday && "bg-primary/5"
                                )}
                                title={`${student.name} - ${day.fullLabel}: ${isPresent ? 'Present' : 'Absent'}`}
                              >
                                {isPresent ? 'P' : 'A'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>`P` = Present</span>
                <span>`A` = Absent</span>
                <span>Today&apos;s column stays in sync with the daily log above.</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
