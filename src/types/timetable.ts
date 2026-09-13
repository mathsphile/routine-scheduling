export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type TimeSlot = '10:00 - 12:00' | '12:00 - 02:00' | '02:30 - 04:30';

export type Facility = 'Blackboard' | 'Projector' | 'Blackboard & Projector';

export type ProgramType = 'B.Tech' | 'M.Tech' | 'M.Sc';

export type TeacherType = 'Internal' | 'External';

export type ClassType = 'Theory' | 'Practical';

export interface TimeSlotPreference {
  day: DayOfWeek;
  timeSlot: TimeSlot;
  facility: Facility;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  program: ProgramType;
  semester: number;
  type: ClassType;
  teacherId: string;
  requiredFacility: Facility;
  sessionsPerWeek: number;
}

export interface Teacher {
  id: string;
  name: string;
  type: TeacherType;
  designation: string;
  preferences: [TimeSlotPreference, TimeSlotPreference, TimeSlotPreference]; // Exactly 3 preferred slots
}

export interface Room {
  id: string;
  name: string;
  type: 'Classroom' | 'Lab' | 'Seminar Hall';
  facility: Facility;
  capacity: number;
}

export interface ScheduledSession {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  program: ProgramType;
  semester: number;
  type: ClassType;
  teacherId: string;
  teacherName: string;
  teacherType: TeacherType;
  roomId: string;
  roomName: string;
  day: DayOfWeek;
  timeSlot: TimeSlot;
  isPreferenceSatisfied: boolean;
}

export interface ConstraintViolation {
  ruleId: string;
  severity: 'error' | 'warning';
  message: string;
  details?: string;
}

export interface SolverResult {
  success: boolean;
  schedule: ScheduledSession[];
  unassignedSubjects: Subject[];
  preferenceSatisfactionRate: number; // percentage 0-100
  internalTeachersFreeDays: Record<string, DayOfWeek>;
  violations: ConstraintViolation[];
  stats: {
    totalSessions: number;
    totalTheory: number;
    totalPractical: number;
    internalTeacherCount: number;
    externalTeacherCount: number;
    solverTimeMs: number;
  };
}
