
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, Home, School, Utensils, BarChart3, 
  Building2, BookOpen, Bell, LogOut, Users, 
  ShieldCheck, Trash2, ClipboardList, Menu, Check, User as UserIcon, Settings, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const NAVIGATION: Record<string, NavItem[]> = {
  administrator: [
    { title: 'Home', href: '/dashboard/administrator', icon: Home },
    { title: 'Schools', href: '/dashboard/administrator/schools', icon: School },
    { title: 'Academic Performance', href: '/dashboard/administrator/academic', icon: BarChart3 },
  ],
  principal: [
    { title: 'Home', href: '/dashboard/principal', icon: Home },
    { title: 'Classes', href: '/dashboard/principal/classes', icon: Users },
    { title: 'Teacher Details', href: '/dashboard/principal/teachers', icon: GraduationCap },
    { title: 'Teachers Attendance', href: '/dashboard/principal/teachers-attendance', icon: ClipboardList },
  ],
  teacher: [
    { title: 'Home', href: '/dashboard/teacher', icon: Home },
    { title: 'Attendance', href: '/dashboard/teacher/attendance', icon: ClipboardList },
    { title: 'Students Marks', href: '/dashboard/teacher/marks', icon: BarChart3 },
    { title: 'Student Details', href: '/dashboard/teacher/students', icon: Users },
  ],
  staff: [
    { title: 'Home', href: '/dashboard/staff', icon: Home },
    { title: 'Stock Management', href: '/dashboard/staff/meals', icon: Utensils },
    { title: 'Cleanliness', href: '/dashboard/staff/cleaning', icon: Trash2 },
  ],
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'MDM Quality Report', description: 'New report submitted for Model Primary A', time: '5m ago', unread: true },
  { id: 2, title: 'Attendance Alert', description: 'Grade 10-A attendance below 80%', time: '1h ago', unread: true },
  { id: 3, title: 'Inventory Low', description: 'Rice stock low at GSSS Town-1', time: '2h ago', unread: false },
  { id: 4, title: 'Infrastructure Update', description: 'RO System repair completed at Primary B', time: 'Yesterday', unread: false },
];

export function DashboardLayout({ children, role }: { children: React.ReactNode, role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const pathname = usePathname();
  const { user, profile, isUserLoading } = useUser();
  const items = NAVIGATION[role] || [];

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // STRICT GATING: Do not mount dashboard children until the profile is confirmed.
  // This prevents queries from running before the security rules engine knows the user's role.
  if (isUserLoading || (user && !profile)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="p-4 rounded-full bg-primary/5">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-primary uppercase tracking-widest animate-pulse">
            Authorizing...
          </p>
          <p className="text-xs text-muted-foreground">Ensuring secure access to {role} records.</p>
        </div>
      </div>
    );
  }

  // If no user is present at all, the layout should technically redirect, but we'll show a safe state
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Session expired. Please sign in again.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-border transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-4 h-16 flex items-center justify-between">
          {isSidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-primary truncate">ShikshaPoshan</span>
            </Link>
          )}
          {!isSidebarOpen && <GraduationCap className="h-6 w-6 text-primary mx-auto" />}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.title} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-primary",
                  !isSidebarOpen && "justify-center"
                )}>
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  {isSidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/login">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition-colors",
              !isSidebarOpen && "justify-center"
            )}>
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-headline font-bold text-primary capitalize">{role} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                </div>
                <ScrollArea className="h-80">
                  <div className="flex flex-col">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "flex flex-col gap-1 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                            notification.unread && "bg-primary/5"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-bold text-primary">{notification.title}</span>
                            <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                          {notification.unread && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              <span className="text-[10px] text-red-500 font-bold uppercase">New</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Check className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-muted-foreground font-medium">All caught up!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-muted-foreground">
                    View All Notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Separator orientation="vertical" className="h-6" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-1.5 rounded-lg transition-colors">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-primary">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role}</p>
                  </div>
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={`https://picsum.photos/seed/${role}/100/100`} />
                    <AvatarFallback className="bg-primary/10 text-primary">{role[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${role}/profile`} className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${role}/settings`} className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-500">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
