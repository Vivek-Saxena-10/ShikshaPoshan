export type Role = 'Administrator' | 'Principal' | 'Teacher' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  district: string;
  studentCount: number;
}

export interface MidDayMeal {
  id: string;
  schoolId: string;
  date: string;
  menu: string;
  studentsServed: number;
  qualityRating: number;
  ingredientsStock: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  gender?: 'male' | 'female' | 'other';
  schoolId: string;
  attendance: { date: string; status: 'present' | 'absent' }[];
  marks: { subject: string; score: number }[];
}

export interface InfrastructureRecord {
  id: string;
  schoolId: string;
  category: 'Infrastructure' | 'Cleaning' | 'Security';
  status: 'Good' | 'Needs Repair' | 'Critical';
  lastInspected: string;
  description: string;
}

export const MOCK_STUDENTS: Student[] = [
  { id: '101', name: 'Rahul Sharma', class: '10-A', gender: 'male', schoolId: '1', attendance: [], marks: [] },
  { id: '102', name: 'Priya Patel', class: '10-A', gender: 'female', schoolId: '1', attendance: [], marks: [] },
  { id: '103', name: 'Amit Kumar', class: '10-A', gender: 'male', schoolId: '1', attendance: [], marks: [] },
  { id: '104', name: 'Sneha Singh', class: '10-A', gender: 'female', schoolId: '1', attendance: [], marks: [] },
  { id: '105', name: 'Vikram Yadav', class: '10-A', gender: 'male', schoolId: '1', attendance: [], marks: [] },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@shiksha.gov', role: 'Administrator' },
  { id: 'u2', name: 'Dr. Mehta', email: 'principal@school.gov', role: 'Principal', schoolId: '1' },
  { id: 'u3', name: 'Mr. Rajesh', email: 'teacher@school.gov', role: 'Teacher', schoolId: '1' },
  { id: 'u4', name: 'Mrs. Laxmi', email: 'staff@school.gov', role: 'Staff', schoolId: '1' },
];
