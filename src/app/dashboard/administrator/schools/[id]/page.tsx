
"use client"

import { use, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Users, Utensils, GraduationCap, 
  MapPin, Calendar, ArrowLeft, ShieldCheck, 
  Phone, Mail, User, Loader2, TrendingUp, BookOpen, FileText, Zap, 
  ChevronDown, ChevronUp, Download, X, Check
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminSchoolProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();
  const { user, profile, isUserLoading } = useUser();
  const { toast } = useToast();

  // Tab expansion states
  const [expandedTab, setExpandedTab] = useState<'bills' | 'uniforms' | 'infra' | null>(null);

  // Guard the document reference until authenticated and role verified
  const schoolDocRef = useMemoFirebase(() => {
    if (isUserLoading || !user || profile?.role !== 'Administrator') return null;
    return doc(firestore, 'schools', resolvedParams.id);
  }, [firestore, resolvedParams.id, user, profile?.role, isUserLoading]);

  // Fetch school details in real-time
  const { data: school, isLoading } = useDoc(schoolDocRef);

  if (isLoading || isUserLoading || (user && !profile)) {
    return (
      <DashboardLayout role="administrator">
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Validating School Record...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!school) {
    return (
      <DashboardLayout role="administrator">
        <div className="space-y-6">
          <Link href="/dashboard/administrator/schools">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Directory
            </Button>
          </Link>
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-primary">Institution Not Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">The requested school record could not be retrieved. It may have been deactivated or you may have insufficient permissions.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="administrator">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/administrator/schools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">{school.name}</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-3 w-3" /> {school.address}, {school.district}
            </p>
          </div>
          <Badge className="ml-auto bg-accent">Active Institution</Badge>
        </div>

        {/* Rest of the UI remains consistent... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: school.studentCount || 450, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { label: 'Total Teachers', value: school.teacherCount || 28, icon: GraduationCap, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
            { label: 'Total Classrooms', value: school.classroomCount || 18, icon: Building2, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
            { label: 'Student-Teacher Ratio', value: school.studentCount && school.teacherCount ? `${(school.studentCount / school.teacherCount).toFixed(1)}:1` : '16.1:1', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
          ].map((stat, i) => (
            <Card key={i} className={`border ${stat.borderColor}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Student Attendance
              </CardTitle>
              <CardDescription>Average daily attendance rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-green-600">
                  {school.studentAverageAttendance || 94.2}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${school.studentAverageAttendance || 94.2}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Out of {school.studentCount || 450} students enrolled
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Teacher Attendance
              </CardTitle>
              <CardDescription>Average daily attendance rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-purple-600">
                  {school.teacherAverageAttendance || 96.5}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${school.teacherAverageAttendance || 96.5}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Out of {school.teacherCount || 28} teachers employed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests & Submissions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-headline font-bold text-primary">Requests & Submissions</h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Mid-Day Meal Reviews Card */}
            <Card className="border border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-orange-600" />
                  Mid-Day Meal Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Today's Reviews</p>
                    <p className="text-2xl font-bold text-orange-600">127</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average Rating</p>
                    <p className="text-lg font-bold text-orange-600">2.8/3.0</p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span>😞 12</span>
                    <span>😐 31</span>
                    <span>😊 84</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Management Bills Card - Expandable */}
            <Card 
              className="border border-blue-200 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedTab(expandedTab === 'bills' ? null : 'bills')}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Stock Bills History
                  </CardTitle>
                  {expandedTab === 'bills' ? (
                    <ChevronUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">This Month Total</p>
                    <p className="text-2xl font-bold text-blue-600">₹1,24,500</p>
                  </div>
                  
                  {expandedTab === 'bills' && (
                    <div className="mt-4 border-t pt-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">May 2026 Bills</p>
                      {[
                        { date: 'May 5, 2026', amount: '₹45,300', items: 'Rice, Dal, Vegetables', status: 'Verified' },
                        { date: 'May 4, 2026', amount: '₹38,900', items: 'Flour, Oil, Spices', status: 'Verified' },
                        { date: 'May 3, 2026', amount: '₹24,500', items: 'Milk, Eggs, Cheese', status: 'Pending' },
                        { date: 'May 2, 2026', amount: '₹15,800', items: 'Vegetables, Fruits', status: 'Verified' },
                      ].map((bill, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="text-xs font-medium">{bill.date}</p>
                              <p className="text-xs text-muted-foreground">{bill.items}</p>
                            </div>
                            <Badge variant={bill.status === 'Verified' ? 'default' : 'secondary'} className="text-xs">
                              {bill.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-bold text-blue-600">{bill.amount}</p>
                          <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs">
                            <Download className="h-3 w-3 mr-1" /> Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uniforms & Books Request Card - Expandable */}
            <Card 
              className="border border-purple-200 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedTab(expandedTab === 'uniforms' ? null : 'uniforms')}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    Uniforms & Books Requests
                  </CardTitle>
                  {expandedTab === 'uniforms' ? (
                    <ChevronUp className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-purple-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pending: 8 | Approved: 24</p>
                    <p className="text-lg font-bold text-purple-600">Est. Amount: ₹45,600</p>
                  </div>
                  
                  {expandedTab === 'uniforms' && (
                    <div className="mt-4 border-t pt-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Recent Requests</p>
                      {[
                        { id: 1, type: 'Uniforms', qty: '450 sets', date: 'May 5', status: 'Pending', amount: '₹22,500' },
                        { id: 2, type: 'Books (Math)', qty: '450 copies', date: 'May 4', status: 'Approved', amount: '₹13,500' },
                        { id: 3, type: 'Uniforms', qty: '50 sets', date: 'Apr 28', status: 'Dispatched', amount: '₹2,500' },
                        { id: 4, type: 'Books (English)', qty: '450 copies', date: 'Apr 25', status: 'Approved', amount: '₹13,500' },
                      ].map((req) => (
                        <div key={req.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="text-xs font-medium">{req.type}</p>
                              <p className="text-xs text-muted-foreground">{req.qty} • {req.date}</p>
                            </div>
                            <Badge variant={req.status === 'Pending' ? 'secondary' : req.status === 'Approved' ? 'outline' : 'default'} className="text-xs">
                              {req.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <p className="text-sm font-bold text-purple-600">{req.amount}</p>
                            {req.status === 'Pending' && (
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-green-600 hover:text-green-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast({
                                      title: "Request Dispatched",
                                      description: `${req.type} request marked as dispatched.`,
                                    });
                                  }}
                                >
                                  <Check className="h-3 w-3" /> Dispatch
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-red-600 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast({
                                      title: "Request Rejected",
                                      description: `${req.type} request has been rejected.`,
                                      variant: "destructive",
                                    });
                                  }}
                                >
                                  <X className="h-3 w-3" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Request Card - Expandable */}
            <Card 
              className="border border-amber-200 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedTab(expandedTab === 'infra' ? null : 'infra')}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Infrastructure Issues
                  </CardTitle>
                  {expandedTab === 'infra' ? (
                    <ChevronUp className="h-4 w-4 text-amber-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-amber-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pending: 5 | Resolved: 18</p>
                    <p className="text-lg font-bold text-amber-600">Est. Cost: ₹2,31,500</p>
                  </div>
                  
                  {expandedTab === 'infra' && (
                    <div className="mt-4 border-t pt-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Recent Issues</p>
                      {[
                        { id: 1, issue: 'Classroom roof leakage - Block A', date: 'May 5', status: 'Pending', image: true, cost: '₹45,000' },
                        { id: 2, issue: 'Water pipeline burst - Ground floor', date: 'May 3', status: 'In Progress', image: true, cost: '₹32,500' },
                        { id: 3, issue: 'Electrical wiring repair - Lab', date: 'May 1', status: 'Pending', image: true, cost: '₹28,000' },
                        { id: 4, issue: 'Playground fence repair', date: 'Apr 28', status: 'Resolved', image: false, cost: '₹15,000' },
                      ].map((issue) => (
                        <div key={issue.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="text-xs font-medium">{issue.issue}</p>
                              <p className="text-xs text-muted-foreground">{issue.date}</p>
                            </div>
                            <Badge variant={issue.status === 'Pending' ? 'secondary' : issue.status === 'In Progress' ? 'outline' : 'default'} className="text-xs">
                              {issue.status}
                            </Badge>
                          </div>
                          {issue.image && (
                            <div className="mb-2 p-2 bg-white rounded border border-gray-300">
                              <img 
                                src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80'%3E%3Crect fill='%23e5e7eb' width='100' height='80'/%3E%3Ctext x='50' y='40' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3EProblem Photo%3C/text%3E%3C/svg%3E`}
                                alt="Issue photo"
                                className="w-full h-20 object-cover rounded"
                              />
                            </div>
                          )}
                          <p className="text-sm font-bold text-amber-600 mb-2">{issue.cost}</p>
                          {issue.status === 'Pending' && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs text-blue-600 hover:text-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Issue Updated",
                                    description: "Infrastructure issue status updated to In Progress.",
                                  });
                                }}
                              >
                                In Progress
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Issue Rejected",
                                    description: "Infrastructure issue has been rejected.",
                                    variant: "destructive",
                                  });
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
