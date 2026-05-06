"use client"

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, GraduationCap, Utensils, ShieldCheck, TrendingUp, BookOpen, Loader2, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function PrincipalHome() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const schoolMetrics = [
    { label: 'Total Enrolled', value: '450', icon: Users, change: '+5%' },
    { label: 'Avg Attendance', value: '94.2%', icon: TrendingUp, change: '+1.2%' },
    { label: 'Teaching Staff', value: '18', icon: GraduationCap, change: 'Stable' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "The school performance report for May 2024 has been downloaded.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout role="principal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">School Overview</h2>
            <p className="text-muted-foreground">Govt. Higher Secondary School A - Campus Report</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" /> Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schoolMetrics.map((m) => (
            <Card key={m.label} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <m.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-accent border-accent">{m.change}</Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-3xl font-bold text-primary">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Teacher Attendance Alerts</CardTitle>
            <CardDescription>Teachers with monthly attendance below 50%.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Ms. Sharma', subject: 'Mathematics', attendance: '46%' },
                { name: 'Mr. Kapoor', subject: 'Science', attendance: '42%' },
                { name: 'Ms. Rao', subject: 'English', attendance: '39%' },
              ].map((teacher, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-2xl border border-border p-4 bg-secondary/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                    </div>
                    <Badge variant="destructive">{teacher.attendance}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">This month's attendance is below the expected threshold; follow up with the teacher for support.</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Academic Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 p-4 border rounded-xl bg-primary/5">
                <div className="h-12 w-12 rounded-lg bg-primary text-white flex flex-col items-center justify-center font-bold">
                  <span className="text-xs">MAY</span>
                  <span>15</span>
                </div>
                <div>
                  <p className="font-bold">Unit Test Series II</p>
                  <p className="text-xs text-muted-foreground">Class VI - X</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-xl bg-accent/5">
                <div className="h-12 w-12 rounded-lg bg-accent text-white flex flex-col items-center justify-center font-bold">
                  <span className="text-xs">MAY</span>
                  <span>22</span>
                </div>
                <div>
                  <p className="font-bold">Parent Teacher Meeting</p>
                  <p className="text-xs text-muted-foreground">Annual Progress Review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}