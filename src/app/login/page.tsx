
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, User, Building, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [role, setRole] = useState<string>('Administrator');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Sign in to Firebase Auth (using anonymous for this prototype)
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 2. Prepare the user profile data
      const userProfileData = {
        id: user.uid,
        email: `${role.toLowerCase()}@shiksha.gov`,
        firstName: 'System',
        lastName: role,
        role: role,
        schoolId: '1', // Default school ID for the prototype
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };

      // 3. Create/Update the user profile in Firestore
      // Using non-blocking pattern as per project guidelines.
      // This leverages local cache for immediate navigation.
      const userDocRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, userProfileData, { merge: true });

      // 4. Immediate feedback and redirection
      toast({
        title: "Signed In",
        description: `Welcome back, ${role}. Accessing your dashboard...`,
      });
      
      // Navigate immediately to the dashboard
      router.push(`/dashboard/${role.toLowerCase()}`);

    } catch (error: any) {
      // Auth errors are handled here, Firestore permission errors are handled via errorEmitter in setDocumentNonBlocking
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Could not sign in anonymously.",
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotOpen(false);
    toast({
      title: "Reset link sent",
      description: "If an account exists for this email, you will receive a reset link shortly.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
              <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger id="role" className="bg-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="name@school.gov" className="pl-10 bg-white" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleForgotPassword}>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your institutional email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email Address</Label>
                          <Input id="reset-email" type="email" placeholder="name@school.gov" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full">Send Reset Link</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-10 bg-white" required />
              </div>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? "Signing in..." : `Sign In as ${role}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/" className="text-sm text-center text-muted-foreground hover:underline">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
