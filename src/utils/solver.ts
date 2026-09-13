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
  sessionIndex: number;
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
  const internalTeachers = teachers.filter(t => t.type === 'Internal');
  const internalTeacherFreeDays: Record<string, DayOfWeek> = {};

  internalTeachers.forEach((teacher, idx) => {
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
  const teacherBookings = new Set<string>();
  const roomBookings = new Set<string>();
  const batchBookings = new Set<string>();

  const teacherDailyCounts = new Map<string, Map<DayOfWeek, { theory: number; practical: number }>>();
  for (const t of teachers) {
    const dayMap = new Map<DayOfWeek, { theory: number; practical: number }>();
    for (const d of DAYS) {
      dayMap.set(d, { theory: 0, practical: 0 });
    }
    teacherDailyCounts.set(t.id, dayMap);
  }

  const subjectScheduledDays = new Map<string, Set<DayOfWeek>>();
  for (const s of subjects) {
    subjectScheduledDays.set(s.id, new Set());
  }

  const assignedSessions: ScheduledSession[] = [];
  const unassigned: Subject[] = [];

  // Sort items to schedule using MRV & Constrained First heuristic:
  itemsToSchedule.sort((a, b) => {
    if (a.subject.type === 'Practical' && b.subject.type !== 'Practical') return -1;
    if (a.subject.type !== 'Practical' && b.subject.type === 'Practical') return 1;
    const tA = teacherMap.get(a.subject.teacherId);
    const tB = teacherMap.get(b.subject.teacherId);
    if (tA?.type === 'External' && tB?.type !== 'External') return -1;
    if (tA?.type !== 'External' && tB?.type === 'External') return 1;
    return b.subject.sessionsPerWeek - a.subject.sessionsPerWeek;
  });

  let stepCount = 0;
  const MAX_STEPS = 15000;
  const MAX_TIME_MS = 80;

  // Backtracking function with timeout & max step guards
  function backtrack(index: number): boolean {
    if (index >= itemsToSchedule.length) {
      return true; // All sessions successfully scheduled!
    }

    stepCount++;
    if (stepCount > MAX_STEPS || (performance.now() - startTime) > MAX_TIME_MS) {
      return false; // Time/step limit reached, fall back to relaxed solver to avoid freezing UI
    }

    const item = itemsToSchedule[index];
    const subject = item.subject;
    const teacher = teacherMap.get(subject.teacherId);
    if (!teacher) return false;
    const freeDay = internalTeacherFreeDays[teacher.id];

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
        continue;
      }

      // Rule: Avoid duplicate sessions of same subject on same day
      if (subjectScheduledDays.get(subject.id)!.has(day) && subject.sessionsPerWeek <= 5) {
        continue;
      }

      // Check Teacher Daily Limits
      const tDaily = teacherDailyCounts.get(teacher.id)!.get(day)!;
      if (subject.type === 'Theory' && tDaily.theory >= 1) {
        continue;
      }
      if (subject.type === 'Practical' && tDaily.practical >= 1) {
        continue;
      }
      if (tDaily.theory + tDaily.practical >= 2) {
        continue;
      }

      for (const timeSlot of TIME_SLOTS) {
        const timeKey = `${day}_${timeSlot}`;
        const tKey = `${teacher.id}_${timeKey}`;
        const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

        if (teacherBookings.has(tKey) || batchBookings.has(bKey)) {
          continue;
        }

        for (const room of rooms) {
          if (subject.type === 'Practical' && room.type !== 'Lab') {
            continue;
          }
          if (subject.type === 'Theory' && room.type === 'Lab') {
            continue;
          }

          if (!isFacilitySatisfied(subject.requiredFacility, room.facility)) {
            continue;
          }

          const rKey = `${room.id}_${timeKey}`;
          if (roomBookings.has(rKey)) {
            continue;
          }

          let score = 0;
          const prefIndex = teacher.preferences.findIndex(
            p => p.day === day && p.timeSlot === timeSlot
          );
          if (prefIndex !== -1) {
            score = 100 - prefIndex * 20;
            const prefFacility = teacher.preferences[prefIndex].facility;
            if (isFacilitySatisfied(prefFacility, room.facility)) {
              score += 10;
            }
          }

          candidates.push({ day, timeSlot, room, preferenceScore: score });
        }
      }
    }

    candidates.sort((a, b) => b.preferenceScore - a.preferenceScore);

    for (const candidate of candidates) {
      const { day, timeSlot, room, preferenceScore } = candidate;
      const timeKey = `${day}_${timeSlot}`;
      const tKey = `${teacher.id}_${timeKey}`;
      const rKey = `${room.id}_${timeKey}`;
      const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

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

      assignedSessions.pop();
      teacherBookings.delete(tKey);
      roomBookings.delete(rKey);
      batchBookings.delete(bKey);

      if (subject.type === 'Theory') tDaily.theory -= 1;
      else tDaily.practical -= 1;

      subjectScheduledDays.get(subject.id)!.delete(day);
    }

    return false;
  }

  let success = backtrack(0);

  // Fallback Phase: If strict hard-constrained backtrack hit limits or incomplete, schedule remaining sessions gracefully
  if (assignedSessions.length < itemsToSchedule.length) {
    for (let i = assignedSessions.length; i < itemsToSchedule.length; i++) {
      const item = itemsToSchedule[i];
      const subject = item.subject;
      const teacher = teacherMap.get(subject.teacherId);
      if (!teacher) continue;

      let bestSlot: { day: DayOfWeek; timeSlot: TimeSlot; room: Room } | null = null;
      let minConflicts = Infinity;

      for (const day of DAYS) {
        for (const timeSlot of TIME_SLOTS) {
          const timeKey = `${day}_${timeSlot}`;
          const tKey = `${teacher.id}_${timeKey}`;
          const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

          let conflictScore = 0;
          if (teacherBookings.has(tKey)) conflictScore += 100;
          if (batchBookings.has(bKey)) conflictScore += 100;

          for (const room of rooms) {
            const rKey = `${room.id}_${timeKey}`;
            let currentConflict = conflictScore;
            if (roomBookings.has(rKey)) currentConflict += 100;

            if (currentConflict < minConflicts) {
              minConflicts = currentConflict;
              bestSlot = { day, timeSlot, room };
            }
          }
        }
      }

      if (bestSlot) {
        const { day, timeSlot, room } = bestSlot;
        const timeKey = `${day}_${timeSlot}`;
        const tKey = `${teacher.id}_${timeKey}`;
        const rKey = `${room.id}_${timeKey}`;
        const bKey = `${subject.program}_Sem${subject.semester}_${timeKey}`;

        teacherBookings.add(tKey);
        roomBookings.add(rKey);
        batchBookings.add(bKey);

        const session: ScheduledSession = {
          id: `SESS-${i + 1}-${subject.code}`,
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
          isPreferenceSatisfied: false
        };

        assignedSessions.push(session);
      } else {
        if (!unassigned.some(u => u.id === subject.id)) {
          unassigned.push(subject);
        }
      }
    }
  }

  const endTime = performance.now();
  const solverTimeMs = Math.round(endTime - startTime);

  const totalSatisfied = assignedSessions.filter(s => s.isPreferenceSatisfied).length;
  const prefRate = assignedSessions.length > 0
    ? Math.round((totalSatisfied / assignedSessions.length) * 100)
    : 0;

  const violations = validateSchedule(assignedSessions, subjects, teachers, rooms);
  success = assignedSessions.length === itemsToSchedule.length && violations.length === 0;

  const totalTheory = assignedSessions.filter(s => s.type === 'Theory').length;
  const totalPractical = assignedSessions.filter(s => s.type === 'Practical').length;

  return {
    success,
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
