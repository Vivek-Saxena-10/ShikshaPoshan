'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Utensils, MapPin, TrendingUp, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function InsightsPage() {
  // Sample Data
  const statistics = [
    {
      title: 'Schools Covered',
      value: '450+',
      description: 'Government schools across regions',
      icon: GraduationCap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Students Benefited',
      value: '125,000+',
      description: 'Direct beneficiaries',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Meals Served',
      value: '2.4M+',
      description: 'This year',
      icon: Utensils,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Active Volunteers',
      value: '1,200+',
      description: 'Community contributors',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Regions Covered',
      value: '8',
      description: 'Districts across the state',
      icon: MapPin,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Growth Rate',
      value: '35%',
      description: 'Year-over-year increase',
      icon: TrendingUp,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    }
  ];

  const regions = [
    'Bangalore Urban', 'Bangalore Rural', 'Dakshina Kannada', 
    'Hassan', 'Chitradurga', 'Belagavi', 'Tumkur', 'Kolar'
  ];

  const monthlyData = [
    { month: 'Jan', meals: 180000 },
    { month: 'Feb', meals: 195000 },
    { month: 'Mar', meals: 210000 },
    { month: 'Apr', meals: 225000 },
    { month: 'May', meals: 240000 },
    { month: 'Jun', meals: 260000 },
  ];

  const schoolGrowth = [
    { year: '2021', schools: 120 },
    { year: '2022', schools: 200 },
    { year: '2023', schools: 320 },
    { year: '2024', schools: 380 },
    { year: '2025', schools: 450 },
  ];

  // Calculate chart heights for visualization
  const maxSchools = Math.max(...schoolGrowth.map(d => d.schools));
  const maxMeals = Math.max(...monthlyData.map(d => d.meals));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">ShikshaPoshan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/login">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black font-headline text-primary">ShikshaPoshan Insights</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground font-medium">
              Tracking our impact on education and nutrition across government schools. Real-time data on our mission to empower students and communities.
            </p>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Our Impact</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {statistics.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl overflow-hidden hover:translate-y-[-4px]">
                    <CardHeader className="pb-4">
                      <div className={`${stat.bgColor} p-4 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <CardTitle className="font-headline text-3xl font-black">{stat.value}</CardTitle>
                      <p className="text-primary font-bold mt-2">{stat.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground font-medium">{stat.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Growth Charts */}
        <section className="w-full py-16 bg-secondary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Growth Trends</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* School Growth Chart */}
              <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Schools Covered Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {schoolGrowth.map((data, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">{data.year}</span>
                          <span className="text-sm font-bold text-muted-foreground">{data.schools} schools</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(data.schools / maxSchools) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Meals Chart */}
              <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Meals Served Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-64">
                    {monthlyData.map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                        <div
                          className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-400 group-hover:shadow-lg"
                          style={{ height: `${(data.meals / maxMeals) * 100}%` }}
                          title={`${data.meals.toLocaleString()} meals`}
                        />
                        <span className="text-xs font-bold text-muted-foreground">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-4">Average: {Math.round(monthlyData.reduce((a, b) => a + b.meals, 0) / monthlyData.length).toLocaleString()} meals/month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mid-Day Meal Impact */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Mid-Day Meal Impact</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>

            <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Nutritional Coverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-primary">Meals Served vs Required</p>
                      <p className="text-sm text-muted-foreground">Academic Year 2024-25</p>
                    </div>
                    <span className="text-3xl font-black text-accent">94%</span>
                  </div>
                  <Progress value={94} className="h-4" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 pt-6 border-t">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Required</p>
                    <p className="text-3xl font-black text-primary">2.56M</p>
                    <p className="text-xs text-muted-foreground">meals for academic year</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Actually Served</p>
                    <p className="text-3xl font-black text-green-500">2.4M</p>
                    <p className="text-xs text-muted-foreground">successfully distributed</p>
                  </div>
                </div>

                <div className="grid gap-4 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Nutritional Standards Met</span>
                      <span className="font-bold text-accent">98%</span>
                    </div>
                    <Progress value={98} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Hygiene Compliance</span>
                      <span className="font-bold text-accent">96%</span>
                    </div>
                    <Progress value={96} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">On-Time Distribution</span>
                      <span className="font-bold text-accent">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Volunteer Section */}
        <section className="w-full py-16 bg-secondary/5">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Volunteer Participation</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="bg-purple-50 p-4 w-fit rounded-xl mb-3">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <CardTitle className="font-headline text-3xl font-black">1,200+</CardTitle>
                  <p className="text-primary font-bold">Active Volunteers</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Passionate community members contributing to the mission</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="bg-blue-50 p-4 w-fit rounded-xl mb-3">
                    <Award className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="font-headline text-3xl font-black">89%</CardTitle>
                  <p className="text-primary font-bold">Participation Rate</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Monthly volunteer engagement</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="bg-green-50 p-4 w-fit rounded-xl mb-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle className="font-headline text-3xl font-black">240+</CardTitle>
                  <p className="text-primary font-bold">Hours/Month</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Community service hours contributed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Regional Coverage</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>

            <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Districts & Regions Served</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {regions.map((region, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors duration-300 border-l-4 border-primary"
                    >
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-bold text-primary">{region}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-sm text-muted-foreground font-medium">
                    <span className="font-bold text-primary">Coverage Expansion:</span> We are actively working to expand our services to more districts. Our goal is to reach 12 additional regions by 2026, ensuring that educational quality and nutritional standards reach every government school across the state.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-headline font-bold text-primary">ShikshaPoshan</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">© 2024 Ministry of Education. Smart School Initiative.</p>
          </div>
          <nav className="flex gap-8">
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Policy</Link>
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Guidelines</Link>
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
