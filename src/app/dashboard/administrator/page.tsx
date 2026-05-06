
"use client"

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { School, Users, Utensils, AlertTriangle, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';

const mdmCoverageData = [
  { district: 'North', coverage: 94 },
  { district: 'South', coverage: 88 },
  { district: 'Central', coverage: 82 },
  { district: 'East', coverage: 91 },
  { district: 'West', coverage: 85 },
  { district: 'Rural', coverage: 76 },
];

const academicTrendData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 70 },
  { month: 'May', score: 78 },
];

const mdmConfig = {
  coverage: {
    label: "Coverage %",
    color: "hsl(var(--primary))",
  },
};

const academicConfig = {
  score: {
    label: "Avg Score %",
    color: "hsl(var(--accent))",
  },
};

export default function AdminHome() {
  const firestore = useFirestore();
  const { user, profile, isUserLoading } = useUser();

  // Wait until the user profile is confirmed as Administrator in Firestore
  const schoolsCollectionRef = useMemoFirebase(() => {
    if (isUserLoading || !user || profile?.role !== 'Administrator') return null;
    return collection(firestore, 'schools');
  }, [firestore, user, profile?.role, isUserLoading]);

  const { data: schools, isLoading: loadingSchools } = useCollection(schoolsCollectionRef);

  const totalStudents = schools?.reduce((acc, s) => acc + (Number(s.studentCount) || 0), 0) || 0;
  const estimatedMealsServed = Math.round(totalStudents * 0.85);
  const criticalAlerts = 5;

  const stats = [
    { label: 'Total Schools', value: (loadingSchools || isUserLoading) ? '...' : (schools?.length || 0).toString(), icon: School, color: 'text-primary' },
    { label: 'Total Students', value: (loadingSchools || isUserLoading) ? '...' : totalStudents.toLocaleString() + '+', icon: Users, color: 'text-accent' },
    { label: 'Meals Today', value: (loadingSchools || isUserLoading) ? '...' : estimatedMealsServed.toLocaleString(), icon: Utensils, color: 'text-orange-500' },
    { label: 'Critical Alerts', value: criticalAlerts.toString(), icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <DashboardLayout role="administrator">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-bold text-primary">Regional Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schools with Low MDM Review */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Low MDM Review Rating</CardTitle>
              <CardDescription>Schools with mid-day meal review below 1.5</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Model Primary School A', review: 1.2, students: 245 },
                  { name: 'Government School #120', review: 1.4, students: 312 },
                  { name: 'Rural Primary School B', review: 1.1, students: 187 },
                ].map((school, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50/30">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-amber-900 truncate">{school.name}</p>
                      <p className="text-sm text-amber-700">Rating: <span className="font-semibold">{school.review}/3</span> • {school.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schools with Low Teacher Attendance */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Low Teacher Attendance</CardTitle>
              <CardDescription>Schools with teacher average attendance below 70%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Senior Secondary School #45', attendance: 65, teachers: 28 },
                  { name: 'High School Town Center', attendance: 68, teachers: 35 },
                  { name: 'District School #201', attendance: 62, teachers: 22 },
                ].map((school, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-red-900 truncate">{school.name}</p>
                      <p className="text-sm text-red-700">Attendance: <span className="font-semibold">{school.attendance}%</span> • {school.teachers} teachers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
