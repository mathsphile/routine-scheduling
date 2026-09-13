import type {
  Subject,
  Teacher,
  Room,
  ScheduledSession,
  SolverResult,
  DayOfWeek,
  TimeSlot
} from '../types/timetable';
import { isFacilitySatisfied, validateSchedule } from './validator';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS: TimeSlot[] = ['10:00 - 12:00', '12:00 - 02:00', '02:30 - 04:30'];

interface UnscheduledItem {
  subject: Subject;
  sessionIndex: number; // e.g. session 1 of 2
}

export function solveTimetable(
  subjects: Subject[],
  teachers: Teacher[],
  rooms: Room[]
): SolverResult {
  const startTime = performance.now();

  // Create lookup map for fast reference
  const teacherMap = new Map<string, Teacher>(teachers.map(t => [t.id, t]));

  // Assign designated free days for internal teachers to guarantee internal teacher free day constraint
  // E.g. spread across Mon-Sat
  const internalTeachers = teachers.filter(t => t.type === 'Internal');
  const internalTeacherFreeDays: Record<string, DayOfWeek> = {};

  internalTeachers.forEach((teacher, idx) => {
    // Pick a day that is NOT in teacher's top preference if possible, or distribute evenly
    const preferredDays = new Set(teacher.preferences.map(p => p.day));
    const nonPrefDay = DAYS.find(d => !preferredDays.has(d));
    if (nonPrefDay) {
      internalTeacherFreeDays[teacher.id] = nonPrefDay;
    } else {
      internalTeacherFreeDays[teacher.id] = DAYS[idx % DAYS.length];
    }
  });

  // Flatten all subject sessions into individual unscheduled items
  const itemsToSchedule: UnscheduledItem[] = [];
  for (const subject of subjects) {
    for (let i = 0; i < subject.sessionsPerWeek; i++) {
      itemsToSchedule.push({ subject, sessionIndex: i });
    }
  }

  // Tracking state structures
  // teacherBookings: `${teacherId}_${day}_${timeSlot}` => boolean
  const teacherBookings = new Set<string>();
  // roomBookings: `${roomId}_${day}_${timeSlot}` => boolean
  const roomBookings = new Set<string>();
  // batchBookings: `${program}_${semester}_${day}_${timeSlot}` => boolean
  const batchBookings = new Set<string>();

  // Teacher daily counts: teacherId -> day -> { theory: number, practical: number }
  const teacherDailyCounts = new Map<string, Map<DayOfWeek, { theory: number; practical: number }>>();
  for (const t of teachers) {
    const dayMap = new Map<DayOfWeek, { theory: number; practical: number }>();
    for (const d of DAYS) {
      dayMap.set(d, { theory: 0, practical: 0 });
    }
    teacherDailyCounts.set(t.id, dayMap);
  }

  // Subject daily scheduled: subjectId -> Set<DayOfWeek> (avoid 2 sessions of same subject on same day if sessionsPerWeek <= 3)
  const subjectScheduledDays = new Map<string, Set<DayOfWeek>>();
  for (const s of subjects) {
    subjectScheduledDays.set(s.id, new Set());
  }

  const assignedSessions: ScheduledSession[] = [];
  const unassigned: Subject[] = [];

  // Sort items to schedule using MRV & Constrained First heuristic:
  // Practicals / Labs first (constrained rooms), then subjects with external teachers, then higher sessions count
  itemsToSchedule.sort((a, b) => {
    if (a.subject.type === 'Practical' && b.subject.type !== 'Practical') return -1;
    if (a.subject.type !== 'Practical' && b.subject.type === 'Practical') return 1;
    const tA = teacherMap.get(a.subject.teacherId);
    const tB = teacherMap.get(b.subject.teacherId);
    if (tA?.type === 'External' && tB?.type !== 'External') return -1;
    if (tA?.type !== 'External' && tB?.type === 'External') return 1;
    return b.subject.sessionsPerWeek - a.subject.sessionsPerWeek;
  });

  // Backtracking function
  function backtrack(index: number): boolean {
    if (index >= itemsToSchedule.length) {
      return true; // All sessions successfully scheduled!
    }

    const item = itemsToSchedule[index];
    const subject = item.subject;
    const teacher = teacherMap.get(subject.teacherId)!;
    const freeDay = internalTeacherFreeDays[teacher.id];

    // Generate possible candidate slots (day, timeSlot, room)
    interface Candidate {
      day: DayOfWeek;
      timeSlot: TimeSlot;
      room: Room;
      preferenceScore: number;
    }

    const candidates: Candidate[] = [];

    for (const day of DAYS) {
      // Rule: Internal Teacher Free Day
      if (teacher.type === 'Internal' && day === freeDay) {
        continue; // Teacher has designated free day on this day
      }

      // Rule: Avoid duplicate sessions of same subject on same day if sessionsPerWeek <= 3
      if (subjectScheduledDays.get(subject.id)!.has(day) && subject.sessionsPerWeek <= 5) {
        continue;
      }

      // Check Teacher Daily Limits
      const tDaily = teacherDailyCounts.get(teacher.id)!.get(day)!;
      if (subject.type === 'Theory' && tDaily.theory >= 1) {
        // Teacher can NOT have more than 1 theory class per day
        continue;
      }
      if (subject.type === 'Practical' && tDaily.practical >= 1) {
        // Avoid >1 practical per day
        continue;
      }
      if (tDaily.theory + tDaily.practical >= 2) {
        // Max 2 classes total per day (1 theory + 1 practical)
        continue;
      }

      for (const timeSlot of TIME_SLOTS) {
        const timeKey = `${day}_${timeSlot}`;
        const tKey = `${teacher.id}_${timeKey}`;
        const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

        // Check if teacher or batch is already booked
        if (teacherBookings.has(tKey) || batchBookings.has(bKey)) {
          continue;
        }

        // Check available rooms matching facility requirements
        for (const room of rooms) {
          // Room type match for practical labs
          if (subject.type === 'Practical' && room.type !== 'Lab') {
            // Prefer labs for practicals
            continue;
          }
          if (subject.type === 'Theory' && room.type === 'Lab') {
            // Keep labs free for practicals
            continue;
          }

          // Facility check
          if (!isFacilitySatisfied(subject.requiredFacility, room.facility)) {
            continue;
          }

          const rKey = `${room.id}_${timeKey}`;
          if (roomBookings.has(rKey)) {
            continue;
          }

          // Calculate teacher preference score
          let score = 0;
          const prefIndex = teacher.preferences.findIndex(
            p => p.day === day && p.timeSlot === timeSlot
          );
          if (prefIndex !== -1) {
            score = 100 - prefIndex * 20; // 100 for 1st pref, 80 for 2nd, 60 for 3rd
            const prefFacility = teacher.preferences[prefIndex].facility;
            if (isFacilitySatisfied(prefFacility, room.facility)) {
              score += 10;
            }
          }

          candidates.push({ day, timeSlot, room, preferenceScore: score });
        }
      }
    }

    // Sort candidates by highest preference score first
    candidates.sort((a, b) => b.preferenceScore - a.preferenceScore);

    // Try candidates
    for (const candidate of candidates) {
      const { day, timeSlot, room, preferenceScore } = candidate;
      const timeKey = `${day}_${timeSlot}`;
      const tKey = `${teacher.id}_${timeKey}`;
      const rKey = `${room.id}_${timeKey}`;
      const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

      // Make Move
      teacherBookings.add(tKey);
      roomBookings.add(rKey);
      batchBookings.add(bKey);

      const tDaily = teacherDailyCounts.get(teacher.id)!.get(day)!;
      if (subject.type === 'Theory') tDaily.theory += 1;
      else tDaily.practical += 1;

      subjectScheduledDays.get(subject.id)!.add(day);

      const session: ScheduledSession = {
        id: `SESS-${index + 1}-${subject.code}`,
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        program: subject.program,
        semester: subject.semester,
        type: subject.type,
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherType: teacher.type,
        roomId: room.id,
        roomName: room.name,
        day,
        timeSlot,
        isPreferenceSatisfied: preferenceScore > 0
      };

      assignedSessions.push(session);

      if (backtrack(index + 1)) {
        return true;
      }

      // Undo Move (Backtrack)
      assignedSessions.pop();
      teacherBookings.delete(tKey);
      roomBookings.delete(rKey);
      batchBookings.delete(bKey);

      if (subject.type === 'Theory') tDaily.theory -= 1;
      else tDaily.practical -= 1;

      subjectScheduledDays.get(subject.id)!.delete(day);
    }

    // If no candidate worked, add subject to unassigned (if fallback mode needed)
    return false;
  }

  const success = backtrack(0);
  const endTime = performance.now();
  const solverTimeMs = Math.round(endTime - startTime);

  // Calculate statistics & preference satisfaction
  const totalSatisfied = assignedSessions.filter(s => s.isPreferenceSatisfied).length;
  const prefRate = assignedSessions.length > 0
    ? Math.round((totalSatisfied / assignedSessions.length) * 100)
    : 0;

  const violations = validateSchedule(assignedSessions, subjects, teachers, rooms);

  const totalTheory = assignedSessions.filter(s => s.type === 'Theory').length;
  const totalPractical = assignedSessions.filter(s => s.type === 'Practical').length;

  return {
    success: success && violations.length === 0,
    schedule: assignedSessions,
    unassignedSubjects: unassigned,
    preferenceSatisfactionRate: prefRate,
    internalTeachersFreeDays: internalTeacherFreeDays,
    violations,
    stats: {
      totalSessions: assignedSessions.length,
      totalTheory,
      totalPractical,
      internalTeacherCount: internalTeachers.length,
      externalTeacherCount: teachers.length - internalTeachers.length,
      solverTimeMs
    }
  };
}
