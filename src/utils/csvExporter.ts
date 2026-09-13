import type { ScheduledSession, Subject, Teacher } from '../types/timetable';

export function exportTimetableCSV(schedule: ScheduledSession[], filename: string = 'cs_timetable.csv') {
  const headers = ['Day', 'Time Slot', 'Program', 'Semester', 'Subject Code', 'Subject Name', 'Type', 'Teacher Name', 'Teacher Type', 'Room'];
  
  const rows = schedule.map(s => [
    s.day,
    `"${s.timeSlot}"`,
    s.program,
    `Sem ${s.semester}`,
    s.subjectCode,
    `"${s.subjectName}"`,
    s.type,
    `"${s.teacherName}"`,
    s.teacherType,
    `"${s.roomName}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSubjectsCSV(subjects: Subject[]) {
  const headers = ['ID', 'Subject Code', 'Subject Name', 'Program', 'Semester', 'Type', 'Teacher ID', 'Required Facility', 'Sessions Per Week'];
  const rows = subjects.map(s => [
    s.id,
    s.code,
    `"${s.name}"`,
    s.program,
    s.semester,
    s.type,
    s.teacherId,
    `"${s.requiredFacility}"`,
    s.sessionsPerWeek
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', 'cs_subjects.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTeachersCSV(teachers: Teacher[]) {
  const headers = ['Teacher ID', 'Name', 'Type', 'Designation', 'Pref 1', 'Pref 2', 'Pref 3'];
  const rows = teachers.map(t => [
    t.id,
    `"${t.name}"`,
    t.type,
    `"${t.designation}"`,
    `"${t.preferences[0].day} ${t.preferences[0].timeSlot} (${t.preferences[0].facility})"`,
    `"${t.preferences[1].day} ${t.preferences[1].timeSlot} (${t.preferences[1].facility})"`,
    `"${t.preferences[2].day} ${t.preferences[2].timeSlot} (${t.preferences[2].facility})"`
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', 'cs_teachers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
