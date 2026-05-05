"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { academicPerformanceInsights, AcademicPerformanceInsightsOutput } from '@/ai/flows/academic-performance-insights-flow';
import { useClassStudents } from '@/lib/student-store';
import { GraduationCap, Users, ClipboardList, Sparkles, Loader2, AlertCircle, X, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherHome() {
  const router = useRouter();
  const students = useClassStudents('10-A');
  const [aiResult, setAiResult] = useState<AcademicPerformanceInsightsOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const { toast } = useToast();

  const runAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const result = await academicPerformanceInsights({
        schoolName: 'Govt. Secondary School #1',
        studentData: students.map(s => ({
          studentId: s.id,
          studentName: s.name,
          grades: s.marks,
          attendanceRecords: s.attendance
        }))
      });
      setAiResult(result);
      toast({
        title: "Analysis Complete",
        description: "AI has generated insights for your classroom.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate AI insights at this time. Please try again.",
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Class 10-A Overview</h2>
            <p className="text-muted-foreground">Manage your classroom activities and student progress.</p>
          </div>
        </div>

        {aiResult && (
          <Card className="border-accent/30 bg-accent/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader className="bg-white/50 border-b flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle className="font-headline text-lg">AI Classroom Intelligence</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAiResult(null)} className="h-8 w-8">
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-white/80 p-4 rounded-lg border border-accent/10 shadow-sm">
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" /> Executive Summary
                </h4>
                <p className="text-sm leading-relaxed text-foreground/80">{aiResult.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" /> Intervention Required
                  </h4>
                  <div className="space-y-3">
                    {aiResult.atRiskStudents.map(student => (
                      <div key={student.studentId} className="p-3 bg-white rounded-lg border border-orange-100 shadow-sm transition-all hover:border-orange-200">
                        <p className="font-bold text-sm text-primary">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground mb-2">{student.reason}</p>
                        <div className="bg-orange-50 p-2 rounded text-[11px] text-orange-700 italic border-l-2 border-orange-400">
                          <strong>Action:</strong> {student.suggestions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-primary">
                    <Lightbulb className="h-4 w-4" /> Pedagogical Strategy
                  </h4>
                  <div className="p-4 bg-white rounded-lg border border-primary/10 shadow-sm h-full">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {aiResult.pedagogicalSuggestions}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline">Attendance</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Today's Log</span>
                  <Badge variant="outline" className="text-accent border-accent">Completed</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Present Rate</span>
                    <span className="text-primary">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline">Pending Marks</CardTitle>
                <div className="p-2 rounded-lg bg-orange-100">
                  <GraduationCap className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Unit Test #2</span>
                  <span className="font-bold text-orange-600">15/45 Evaluated</span>
                </div>
                <div className="space-y-1.5">
                   <Progress value={33} className="h-2" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 font-bold"
                  onClick={() => router.push('/dashboard/teacher/marks')}
                >
                  Continue Data Entry
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline">Resources</CardTitle>
                <div className="p-2 rounded-lg bg-accent/10">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uniforms Distributed</span>
                  <span className="font-bold">{students.length > 0 ? `${Math.max(Math.round(((students.length - 2) / students.length) * 100), 0)}%` : '0%'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Book Kits Remaining</span>
                  <span className="font-bold text-primary">{students.length > 0 ? '2 Units' : '0 Units'}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">Inventory Management</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="font-headline text-lg">Daily Schedule & Duties</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="space-y-3">
               {[
                 { time: '09:00 AM', subject: 'Mathematics (Class 10-A)', status: 'Upcoming', type: 'Class' },
                 { time: '10:30 AM', subject: 'Science - Practical Lab', status: 'Upcoming', type: 'Lab' },
                 { time: '12:30 PM', subject: 'Mid-Day Meal Duty', status: 'In Progress', type: 'Duty' },
                 { time: '02:00 PM', subject: 'Staff Meeting', status: 'Upcoming', type: 'Meeting' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border hover:border-primary/20 transition-colors">
                   <div className="flex items-center gap-6">
                     <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-md w-24 text-center">
                       {item.time}
                     </span>
                     <div>
                       <span className="font-bold text-sm block">{item.subject}</span>
                       <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{item.type}</span>
                     </div>
                   </div>
                   <Badge variant={item.status === 'In Progress' ? 'default' : 'outline'} className={item.status === 'In Progress' ? 'bg-accent' : ''}>
                     {item.status}
                   </Badge>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
