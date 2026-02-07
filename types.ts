
export enum DurationType {
  DAYS = 'Days',
  WEEKS = 'Weeks',
  MONTHS = 'Months',
  SEMESTERS = 'Semesters'
}

export type UserRole = 'student' | 'teacher';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Resource {
  type: 'video' | 'article' | 'blog' | 'documentation';
  title: string;
  url: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  quiz?: Quiz;
  resources?: Resource[];
  isCompleted?: boolean;
}

export interface Course {
  courseName: string;
  courseCode: string;
  description: string;
  topics: Topic[];
}

export interface Period {
  periodLabel: string; // e.g., "Day 1", "Week 1"
  courses: Course[];
}

export interface Curriculum {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  durationValue: number;
  durationType: DurationType;
  periods: Period[];
  obe_outcomes: string[];
  job_roles: string[];
  capstone_projects: string[];
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  topicTitle: string;
  questions: MCQ[];
}

export interface User {
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}
