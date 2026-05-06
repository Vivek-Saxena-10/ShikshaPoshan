
"use client"

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, School as SchoolIcon, MoreVertical, Eye, Edit, Trash2, Loader2, Filter, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
  useUser 
} from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';

export default function AdminSchools() {
  const { toast } = useToast();
  const router = useRouter();
  
  // Modal visibility states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  
  // Data targets for modals
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<any>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  
  const firestore = useFirestore();
  const { user, profile, isUserLoading } = useUser();

  // STABILIZE REFERENCE: Ensure query ONLY fires when profile role is verified Administrator
  const schoolsCollectionRef = useMemoFirebase(() => {
    // ESSENTIAL: Wait for user profile to be non-null and role to be correct
    if (isUserLoading || !user?.uid || !profile || profile.role !== 'Administrator') return null;
    return collection(firestore, 'schools');
  }, [firestore, user?.uid, profile, isUserLoading]);

  const { data: schools, isLoading } = useCollection(schoolsCollectionRef);

  // Derive filtered list
  const filteredSchools = useMemo(() => {
    if (!schools) return [];
    
    return schools.filter(school => {
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch = !term || 
        (school.name && school.name.toLowerCase().includes(term)) || 
        (school.district && school.district.toLowerCase().includes(term));
      
      const matchesDistrict = selectedDistrict === 'All' || school.district === selectedDistrict;
      
      return matchesSearch && matchesDistrict;
    });
  }, [schools, searchQuery, selectedDistrict]);

  // Interaction Cleanup
  useEffect(() => {
    if (!isEditDialogOpen) {
      const timer = setTimeout(() => setEditingSchool(null), 200);
      return () => clearTimeout(timer);
    }
  }, [isEditDialogOpen]);

  useEffect(() => {
    if (!isDeactivateDialogOpen) {
      const timer = setTimeout(() => setSchoolToDelete(null), 200);
      return () => clearTimeout(timer);
    }
  }, [isDeactivateDialogOpen]);

  const handleAddSchool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!schoolsCollectionRef) return;

    const formData = new FormData(e.currentTarget);
    const newSchool = {
      name: formData.get('name') as string,
      district: formData.get('district') as string,
      address: formData.get('address') as string,
      studentCount: Number(formData.get('students')),
      city: 'Unknown',
      state: 'Delhi',
      pincode: '110001',
      establishmentYear: new Date().getFullYear(),
      principalId: 'TBD',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDocumentNonBlocking(schoolsCollectionRef, newSchool);
    setIsAddDialogOpen(false);
    toast({
      title: "School Added",
      description: `${newSchool.name} is now registered.`,
    });
  };

  const handleEditSchool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSchool) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      district: formData.get('district') as string,
      address: formData.get('address') as string,
      studentCount: Number(formData.get('students')),
      updatedAt: serverTimestamp(),
    };

    const schoolRef = doc(firestore, 'schools', editingSchool.id);
    updateDocumentNonBlocking(schoolRef, updatedData);
    setIsEditDialogOpen(false);
    toast({
      title: "School Updated",
      description: "Changes have been saved successfully.",
    });
  };

  const handleDeactivateSchool = () => {
    if (!schoolToDelete) return;

    const schoolRef = doc(firestore, 'schools', schoolToDelete.id);
    deleteDocumentNonBlocking(schoolRef);
    setIsDeactivateDialogOpen(false);
    toast({
      variant: "destructive",
      title: "School Deactivated",
      description: "The record has been removed from the network.",
    });
  };

  return (
    <DashboardLayout role="administrator">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">School Directory</h2>
            <p className="text-muted-foreground">Real-time management of regional institutions.</p>
          </div>
          
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent">
            <Plus className="mr-2 h-4 w-4" /> Add New School
          </Button>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or district..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={selectedDistrict !== 'All' ? "border-primary text-primary" : ""}>
                <Filter className="mr-2 h-4 w-4" />
                {selectedDistrict === 'All' ? 'Filter by District' : selectedDistrict}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select District</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['All', 'North Delhi', 'South Delhi', 'Central Jaipur', 'Rural Ajmer'].map((d) => (
                <DropdownMenuItem key={d} onClick={() => setSelectedDistrict(d)}>
                  <div className="flex items-center gap-2 w-full">
                    {d === selectedDistrict && <Check className="h-4 w-4 text-primary" />}
                    <span className={d === selectedDistrict ? "font-bold" : ""}>{d}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(selectedDistrict !== 'All' || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedDistrict('All'); }} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {(isLoading || isUserLoading) ? (
              <div className="p-12 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-bold">Synchronizing Records...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.length > 0 ? (
                    filteredSchools.map((school) => (
                      <TableRow 
                        key={school.id}
                        onClick={() => router.push(`/dashboard/administrator/schools/${school.id}`)}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary/5 text-primary">
                              <SchoolIcon className="h-4 w-4" />
                            </div>
                            <span className="hover:underline underline-offset-4 decoration-primary/30">
                              {school.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{school.district}</TableCell>
                        <TableCell>{school.studentCount || 0}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-accent border border-accent/20">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/administrator/schools/${school.id}`} className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" /> View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setEditingSchool(school);
                                  setIsEditDialogOpen(true);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setSchoolToDelete(school);
                                  setIsDeactivateDialogOpen(true);
                                }}
                                className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" /> Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                        No institutions found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add School Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSchool}>
              <DialogHeader>
                <DialogTitle>Register New School</DialogTitle>
                <DialogDescription>Add a new institution to the monitoring network.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Model Secondary School" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <select 
                      id="district" 
                      name="district"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    >
                      <option>North Delhi</option>
                      <option>South Delhi</option>
                      <option>Central Jaipur</option>
                      <option>Rural Ajmer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="students">Estimated Students</Label>
                    <Input id="students" name="students" type="number" placeholder="450" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" name="address" placeholder="Main Street, Sector 4..." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary">Confirm Registration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit School Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleEditSchool}>
              <DialogHeader>
                <DialogTitle>Edit Institutional Details</DialogTitle>
                <DialogDescription>Update records for {editingSchool?.name}.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">School Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingSchool?.name} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-district">District</Label>
                    <select 
                      id="edit-district" 
                      name="district"
                      defaultValue={editingSchool?.district}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option>North Delhi</option>
                      <option>South Delhi</option>
                      <option>Central Jaipur</option>
                      <option>Rural Ajmer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-students">Student Count</Label>
                    <Input id="edit-students" name="students" type="number" defaultValue={editingSchool?.studentCount} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input id="edit-address" name="address" defaultValue={editingSchool?.address} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Deactivate Dialog */}
        <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will deactivate <strong>{schoolToDelete?.name}</strong>. While records are preserved for auditing, it will be removed from active monitoring dashboards.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeactivateSchool} className="bg-red-600 hover:bg-red-700">
                Confirm Deactivation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
