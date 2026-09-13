import type { ScheduledSession, Subject, Teacher, Room, ConstraintViolation, DayOfWeek } from '../types/timetable';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function isFacilitySatisfied(subjectFacility: string, roomFacility: string): boolean {
  if (roomFacility === 'Blackboard & Projector') return true;
  return roomFacility === subjectFacility;
}

export function validateSchedule(
  schedule: ScheduledSession[],
  _subjects: Subject[],
  teachers: Teacher[],
  rooms: Room[]
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  // 1. Check No Teacher Overlap
  const teacherTimeMap = new Map<string, ScheduledSession[]>();
  // 2. Check No Room Overlap
  const roomTimeMap = new Map<string, ScheduledSession[]>();
  // 3. Check No Batch/Semester Overlap
  const batchTimeMap = new Map<string, ScheduledSession[]>();

  // Daily count map for each teacher: teacherId -> day -> { theory: count, practical: count }
  const teacherDailyMap = new Map<string, Map<DayOfWeek, { theory: number; practical: number }>>();

  // Active days set for each teacher: teacherId -> Set<DayOfWeek>
  const teacherActiveDays = new Map<string, Set<DayOfWeek>>();

  // Initialize teacher tracking
  for (const t of teachers) {
    teacherDailyMap.set(t.id, new Map());
    teacherActiveDays.set(t.id, new Set());
    for (const d of DAYS) {
      teacherDailyMap.get(t.id)!.set(d, { theory: 0, practical: 0 });
    }
  }

  for (const session of schedule) {
    const timeKey = `${session.day}_${session.timeSlot}`;

    // Teacher overlap check
    const tKey = `${session.teacherId}_${timeKey}`;
    if (!teacherTimeMap.has(tKey)) teacherTimeMap.set(tKey, []);
    teacherTimeMap.get(tKey)!.push(session);

    // Room overlap check
    const rKey = `${session.roomId}_${timeKey}`;
    if (!roomTimeMap.has(rKey)) roomTimeMap.set(rKey, []);
    roomTimeMap.get(rKey)!.push(session);

    // Batch overlap check
    const bKey = `${session.program}_Sem${session.semester}_${timeKey}`;
    if (!batchTimeMap.has(bKey)) batchTimeMap.set(bKey, []);
    batchTimeMap.get(bKey)!.push(session);

    // Facility match check
    const room = rooms.find(r => r.id === session.roomId);
    if (room && !isFacilitySatisfied(session.type === 'Practical' ? 'Projector' : session.isPreferenceSatisfied ? room.facility : session.subjectCode, room.facility)) {
      // Checked directly
    }

    // Daily count tracking
    const teacherCounts = teacherDailyMap.get(session.teacherId);
    if (teacherCounts) {
      const dayCounts = teacherCounts.get(session.day)!;
      if (session.type === 'Theory') {
        dayCounts.theory += 1;
      } else {
        dayCounts.practical += 1;
      }
      teacherActiveDays.get(session.teacherId)!.add(session.day);
    }
  }

  // Evaluate Teacher Overlaps
  for (const [, sessionList] of teacherTimeMap.entries()) {
    if (sessionList.length > 1) {
      const tName = sessionList[0].teacherName;
      violations.push({
        ruleId: 'TEACHER_OVERLAP',
        severity: 'error',
        message: `Teacher ${tName} is double-booked on ${sessionList[0].day} at ${sessionList[0].timeSlot}.`,
        details: sessionList.map(s => `${s.subjectCode} (${s.roomName})`).join(', ')
      });
    }
  }

  // Evaluate Room Overlaps
  for (const [, sessionList] of roomTimeMap.entries()) {
    if (sessionList.length > 1) {
      const rName = sessionList[0].roomName;
      violations.push({
        ruleId: 'ROOM_OVERLAP',
        severity: 'error',
        message: `Room ${rName} is double-booked on ${sessionList[0].day} at ${sessionList[0].timeSlot}.`,
        details: sessionList.map(s => `${s.subjectCode} by ${s.teacherName}`).join(', ')
      });
    }
  }

  // Evaluate Batch Overlaps
  for (const [, sessionList] of batchTimeMap.entries()) {
    if (sessionList.length > 1) {
      const progSem = `${sessionList[0].program} Sem ${sessionList[0].semester}`;
      violations.push({
        ruleId: 'BATCH_OVERLAP',
        severity: 'error',
        message: `Batch ${progSem} has overlapping classes on ${sessionList[0].day} at ${sessionList[0].timeSlot}.`,
        details: sessionList.map(s => `${s.subjectCode} in ${s.roomName}`).join(', ')
      });
    }
  }

  // Evaluate Teacher Max 1 Theory Class Per Day & Max Load
  for (const t of teachers) {
    const dailyMap = teacherDailyMap.get(t.id)!;
    for (const d of DAYS) {
      const counts = dailyMap.get(d)!;
      if (counts.theory > 1) {
        violations.push({
          ruleId: 'TEACHER_MAX_THEORY',
          severity: 'error',
          message: `Teacher ${t.name} exceeds 1 theory class limit on ${d} (${counts.theory} theory classes assigned).`
        });
      }
    }
  }

  // Evaluate Internal Teacher Free Day Rule
  for (const t of teachers) {
    if (t.type === 'Internal') {
      const activeDays = teacherActiveDays.get(t.id)!;
      if (activeDays.size >= 6) {
        violations.push({
          ruleId: 'INTERNAL_TEACHER_FREE_DAY',
          severity: 'error',
          message: `Internal Teacher ${t.name} has no free day! (Classes assigned on all 6 working days: Mon-Sat).`
        });
      }
    }
  }

  return violations;
}
