
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GraduationCap, Utensils, Eye, Newspaper, Users } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner') || {
    imageUrl: "https://images.unsplash.com/photo-1495727034151-8fdc73e332a8?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Indian School Building",
    imageHint: "indian school"
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">ShikshaPoshan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login">
            <Button variant="default" size="sm" className="font-bold px-6">Sign In</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
          {/* Heavy overlays to ensure text readability and hide specific details/names in the photo */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          
          <div className="container relative px-4 md:px-6 mx-auto z-10">
            <div className="flex flex-col items-center space-y-6 text-center text-white">
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-headline drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  ShikshaPoshan
                </h1>
                <p className="mx-auto max-w-[800px] text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-accent-foreground/90 drop-shadow-lg">
                  Empowering Education, Ensuring Nutrition
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/insights">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-black px-12 py-7 text-xl rounded-xl shadow-2xl transition-transform hover:scale-105">
                    Insights
                  </Button>
                </Link>
                <Link href="/volunteering">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-12 py-7 text-xl rounded-xl backdrop-blur-sm">
                    Join as Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">About Us</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>
            <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
              <p>
                ShikshaPoshan is a web-based smart monitoring system designed to improve the quality of education and the effectiveness of mid-day meal programs in government schools. Our platform aims to bring transparency, accountability, and real-time insights into school operations, ensuring that students receive both quality learning and proper nutrition.
              </p>
              <p>
                We believe that education and nutrition go hand in hand in shaping a child's future. ShikshaPoshan provides an integrated solution where school authorities, administrators, and stakeholders can monitor attendance, academic progress, meal distribution, and hygiene standards through a single digital platform.
              </p>
              <p>
                By leveraging technology, we strive to reduce manual errors, prevent misuse of resources, and enable data-driven decision-making. Our system empowers authorities to identify gaps, take timely action, and ensure that every child benefits from government initiatives.
              </p>
              <p className="font-bold text-primary pt-4">
                At ShikshaPoshan, our mission is to support a healthier, smarter, and more transparent education system for all.
              </p>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="w-full py-24 bg-white border-b">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-black font-headline text-primary">Our Core Pillars</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {[
                { title: 'Academic Excellence', icon: GraduationCap, desc: 'We ensure consistent monitoring of student attendance and learning progress, helping schools maintain high educational standards and identify areas that need improvement.', color: 'text-blue-500' },
                { title: 'Proper Nutrition', icon: Utensils, desc: 'Our system tracks mid-day meal distribution, ensuring every child receives healthy, hygienic, and timely meals to support their growth and learning.', color: 'text-orange-500' },
                { title: 'Transparency & Accountability', icon: Eye, desc: 'ShikshaPoshan promotes transparency by providing real-time data and reports, reducing misuse of resources and ensuring accountability at every level.', color: 'text-purple-500' },
              ].map((pillar, i) => (
                <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-col items-center pt-10">
                    <div className={cn("p-4 rounded-2xl bg-muted group-hover:scale-110 transition-transform duration-300", pillar.color)}>
                      <pillar.icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-2xl pt-6 text-center">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-10 text-muted-foreground font-medium px-8">
                    {pillar.desc}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Impact */}
        <section className="w-full py-24 bg-secondary/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-black font-headline text-primary leading-tight">Driving Change in Government Education</h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  We believe that every child deserves access to quality learning and proper nutrition. ShikshaPoshan bridges the gap between administrative oversight and ground-level implementation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl"><Users className="h-6 w-6 text-primary" /></div>
                    <div><p className="text-2xl font-black text-primary">1,200+</p><p className="text-xs font-bold text-muted-foreground uppercase">Active Volunteers</p></div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                    <div className="bg-accent/10 p-3 rounded-xl"><GraduationCap className="h-6 w-6 text-accent" /></div>
                    <div><p className="text-2xl font-black text-accent">450+</p><p className="text-xs font-bold text-muted-foreground uppercase">Digital Schools</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground font-medium">© 2026 ShikshaPoshan | Academic Project | All Rights Reserved</p>
            <nav className="flex gap-6">
              <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/insights">
                Insights
              </Link>
              <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/volunteering">
                Volunteer
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
