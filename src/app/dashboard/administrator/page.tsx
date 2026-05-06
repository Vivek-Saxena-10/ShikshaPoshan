
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

  const stats = [
    { label: 'Total Schools', value: (loadingSchools || isUserLoading) ? '...' : (schools?.length || 0).toString(), icon: School, color: 'text-primary' },
    { label: 'Total Students', value: (loadingSchools || isUserLoading) ? '...' : totalStudents.toLocaleString() + '+', icon: Users, color: 'text-accent' },
    { label: 'Meals Today', value: '118,400', icon: Utensils, color: 'text-orange-500' },
    { label: 'Critical Alerts', value: '12', icon: AlertTriangle, color: 'text-red-500' },
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

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Recent Alerts</CardTitle>
            <CardDescription>Critical issues requiring immediate administrative attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-red-100 bg-red-50/30">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">MDM Quality Concern - School #{i*120}</p>
                    <p className="text-sm text-red-700">Stock discrepancy reported in spices and legumes for the upcoming week.</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
