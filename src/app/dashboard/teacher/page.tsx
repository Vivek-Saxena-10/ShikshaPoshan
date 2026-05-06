"use client"

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import { getStoredStudents, getStudentsByClass, useClassStudents } from '@/lib/student-store';

const ATTENDANCE_TEACHER_DATE_KEY = 'teacher-attendance-taken-date';
const TEACHER_CLASS = '10-A';
const LOW_MARKS_THRESHOLD = 30;

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const getDateKey = (date: Date) => date.toISOString().slice(0, 10);
const getAbsentStreak = (attendance: { date: string; status: 'present' | 'absent' }[]) => {
  if (attendance.length === 0) {
    return 0;
  }

  const sortedAttendance = [...attendance].sort((a, b) => b.date.localeCompare(a.date));
  if (sortedAttendance[0].status !== 'absent') {
    return 0;
  }

  let streak = 1;
  let previousDate = new Date(sortedAttendance[0].date);

  for (let i = 1; i < sortedAttendance.length; i += 1) {
    const record = sortedAttendance[i];
    const currentDate = new Date(record.date);
    const expectedDate = new Date(previousDate);
    expectedDate.setDate(previousDate.getDate() - 1);

    if (getDateKey(currentDate) !== getDateKey(expectedDate) || record.status !== 'absent') {
      break;
    }

    streak += 1;
    previousDate = currentDate;
  }

  return streak;
};

export default function TeacherHome() {
  const students = useClassStudents(TEACHER_CLASS);
  const [studentList, setStudentList] = useState(students);
  const [attendancePhoto, setAttendancePhoto] = useState('');
  const [pendingAssignments] = useState(['Math worksheet review', 'Science lab report']);
  const [isAttendanceTaken, setIsAttendanceTaken] = useState(false);
  const averageClassAttendance = 88;

  useEffect(() => {
    setStudentList(students);
  }, [students]);

  useEffect(() => {
    const storedDate = typeof window !== 'undefined' ? localStorage.getItem(ATTENDANCE_TEACHER_DATE_KEY) : null;
    setIsAttendanceTaken(storedDate === getTodayKey());
  }, []);

  useEffect(() => {
    const syncStudents = () => {
      setStudentList(getStudentsByClass(TEACHER_CLASS, getStoredStudents()));
    };

    syncStudents();
    window.addEventListener('student-store-updated', syncStudents);
    window.addEventListener('storage', syncStudents);

    return () => {
      window.removeEventListener('student-store-updated', syncStudents);
      window.removeEventListener('storage', syncStudents);
    };
  }, []);

  const lowMarkStudents = useMemo(
    () => studentList
      .map((student) => ({
        student,
        lowMarks: student.marks.filter((mark) => mark.score < LOW_MARKS_THRESHOLD),
      }))
      .filter((record) => record.lowMarks.length > 0),
    [studentList]
  );

  const absentWarningStudents = useMemo(
    () => studentList
      .map((student) => ({
        student,
        streak: getAbsentStreak(student.attendance),
      }))
      .filter((record) => record.streak >= 4),
    [studentList]
  );

  const marksDistribution = useMemo(() => {
    const totals = studentList.map((student) => {
      const scores = student.marks.map((mark) => mark.score);
      return scores.length > 0 ? scores.reduce((total, score) => total + score, 0) / scores.length : 0;
    });

    const buckets = {
      above90: 0,
      above80: 0,
      above50: 0,
      above30: 0,
      below30: 0,
    };

    totals.forEach((average) => {
      if (average > 90) {
        buckets.above90 += 1;
      } else if (average > 80) {
        buckets.above80 += 1;
      } else if (average > 50) {
        buckets.above50 += 1;
      } else if (average > 30) {
        buckets.above30 += 1;
      } else {
        buckets.below30 += 1;
      }
    });

    return [
      { name: 'Above 90%', value: buckets.above90, fill: '#22c55e' },
      { name: '80-90%', value: buckets.above80, fill: '#38bdf8' },
      { name: '50-80%', value: buckets.above50, fill: '#facc15' },
      { name: '30-50%', value: buckets.above30, fill: '#fb923c' },
      { name: 'Below 30%', value: buckets.below30, fill: '#ef4444' },
    ];
  }, [students]);

  const hasCriticalWarnings = lowMarkStudents.length > 0 || absentWarningStudents.length > 0;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <Card className="rounded-3xl border border-border bg-background shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl border border-border bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Academic Responsibility</p>
                <p className="mt-3 text-2xl font-bold text-foreground">Class - 6th</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Teacher's Attendance</p>
                  <p className="mt-3 text-4xl font-bold text-primary">92%</p>
                  <p className="text-xs text-muted-foreground mt-2">Monthly</p>
                </div>
                <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Number of Students</p>
                  <p className="mt-3 text-4xl font-bold text-foreground">36</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Average Class Attendance</p>
              <p className="mt-3 text-4xl font-bold text-foreground">{averageClassAttendance}%</p>
              <p className="text-xs text-muted-foreground mt-2">Across all students</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border border-border bg-background shadow-sm">
            <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-headline">Student Attendance Check</CardTitle>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${isAttendanceTaken ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                {isAttendanceTaken ? 'Completed' : 'Pending'}
              </span>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <p className={`text-sm ${isAttendanceTaken ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                {isAttendanceTaken
                  ? 'Attendance has been recorded for today.'
                  : 'Teacher has not yet taken student attendance today.'}
              </p>

              <div>
                <p className="text-sm text-muted-foreground">
                  Attendance status is driven by the attendance page. This dashboard reflects the latest recorded state.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border bg-background shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-headline">Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {hasCriticalWarnings ? (
                <div className="space-y-4">
                  {lowMarkStudents.length > 0 && (
                    <div className="space-y-2 rounded-3xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-700">Low marks alert</p>
                      <ul className="space-y-2">
                        {lowMarkStudents.map(({ student, lowMarks }) => (
                          <li key={student.id} className="text-sm text-red-700">
                            <span className="font-semibold">{student.name}</span> has low marks in{' '}
                            {lowMarks.map((mark) => mark.subject).join(', ')}.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {absentWarningStudents.length > 0 && (
                    <div className="space-y-2 rounded-3xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-700">Attendance alert</p>
                      <ul className="space-y-2">
                        {absentWarningStudents.map(({ student, streak }) => (
                          <li key={student.id} className="text-sm text-red-700">
                            <span className="font-semibold">{student.name}</span> has been absent for {streak} consecutive days.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No alerts at this time.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border border-border bg-background shadow-sm">
          <CardHeader className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-lg font-headline">Marks Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Student performance buckets by average score.</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marksDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    stroke="transparent"
                  >
                    {marksDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} students`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {marksDistribution.map((slice) => (
                <div key={slice.name} className="rounded-3xl border border-border bg-white p-3 text-center shadow-sm">
                  <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{slice.name}</div>
                  <div className="text-2xl font-bold text-foreground">{slice.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
