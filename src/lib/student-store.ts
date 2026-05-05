"use client"

import { useEffect, useState } from 'react';

import { MOCK_STUDENTS, Student } from '@/lib/db';

const STUDENT_STORAGE_KEY = 'school-students';
const STUDENT_STORE_EVENT = 'student-store-updated';

const cloneStudents = (students: Student[]) => students.map((student) => ({
  ...student,
  attendance: [...student.attendance],
  marks: [...student.marks],
}));

export const getStoredStudents = (): Student[] => {
  if (typeof window === 'undefined') {
    return cloneStudents(MOCK_STUDENTS);
  }

  const savedStudents = window.localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!savedStudents) {
    const seededStudents = cloneStudents(MOCK_STUDENTS);
    window.localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(seededStudents));
    return seededStudents;
  }

  try {
    return JSON.parse(savedStudents) as Student[];
  } catch {
    const fallbackStudents = cloneStudents(MOCK_STUDENTS);
    window.localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(fallbackStudents));
    return fallbackStudents;
  }
};

export const saveStudents = (students: Student[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
  window.dispatchEvent(new Event(STUDENT_STORE_EVENT));
};

export const getStudentsByClass = (className: string, students: Student[]) =>
  students.filter((student) => student.class === className);

export const getNextStudentId = (students: Student[]) => {
  const maxId = students.reduce((highest, student) => {
    const numericId = Number.parseInt(student.id, 10);
    return Number.isNaN(numericId) ? highest : Math.max(highest, numericId);
  }, 100);

  return String(maxId + 1);
};

export const addStudent = (student: Student) => {
  const students = getStoredStudents();
  saveStudents([...students, student]);
};

export const removeStudent = (studentId: string) => {
  const students = getStoredStudents();
  saveStudents(students.filter((student) => student.id !== studentId));
};

export const useClassStudents = (className: string) => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const syncStudents = () => {
      setStudents(getStudentsByClass(className, getStoredStudents()));
    };

    syncStudents();
    window.addEventListener(STUDENT_STORE_EVENT, syncStudents);
    window.addEventListener('storage', syncStudents);

    return () => {
      window.removeEventListener(STUDENT_STORE_EVENT, syncStudents);
      window.removeEventListener('storage', syncStudents);
    };
  }, [className]);

  return students;
};
