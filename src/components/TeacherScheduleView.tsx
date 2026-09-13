import React, { useState } from 'react';
import type { Teacher, ScheduledSession, DayOfWeek, TimeSlot } from '../types/timetable';
import { User, Calendar, Award, CheckCircle2 } from 'lucide-react';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS: TimeSlot[] = ['10:00 - 12:00', '12:00 - 02:00', '02:30 - 04:30'];

interface TeacherScheduleViewProps {
  teachers: Teacher[];
  schedule: ScheduledSession[];
  freeDaysMap: Record<string, DayOfWeek>;
}

export const TeacherScheduleView: React.FC<TeacherScheduleViewProps> = ({
  teachers,
  schedule,
  freeDaysMap
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const teacher = teachers.find(t => t.id === selectedTeacherId);

  const teacherSessions = schedule.filter(s => s.teacherId === selectedTeacherId);

  // Calculate daily load
  const dailyLoadMap: Record<DayOfWeek, { theory: number; practical: number }> = {
    Monday: { theory: 0, practical: 0 },
    Tuesday: { theory: 0, practical: 0 },
    Wednesday: { theory: 0, practical: 0 },
    Thursday: { theory: 0, practical: 0 },
    Friday: { theory: 0, practical: 0 },
    Saturday: { theory: 0, practical: 0 }
  };

  teacherSessions.forEach(s => {
    if (s.type === 'Theory') dailyLoadMap[s.day].theory += 1;
    else dailyLoadMap[s.day].practical += 1;
  });

  const freeDay = teacher ? freeDaysMap[teacher.id] : null;

  return (
    <div className="teacher-view-container">
      <div className="teacher-view-header">
        <div>
          <h2 className="section-title">Faculty Timetable & Workload Verification</h2>
          <p className="section-subtitle">
            Inspect individual faculty schedules, preference satisfaction, and verified free day rule
          </p>
        </div>

        <div className="teacher-selector">
          <label>Select Faculty Member:</label>
          <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)}>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type}) - {t.designation}
              </option>
            ))}
          </select>
        </div>
      </div>

      {teacher && (
        <>
          <div className="teacher-profile-card">
            <div className="profile-main">
              <div className="profile-avatar">
                <User size={24} />
              </div>
              <div>
                <h3>{teacher.name}</h3>
                <p className="text-muted">{teacher.designation} • <span className={`type-badge ${teacher.type === 'Internal' ? 'badge-green' : 'badge-orange'}`}>{teacher.type} Faculty</span></p>
              </div>
            </div>

            <div className="profile-stats">
              {teacher.type === 'Internal' && (
                <div className="free-day-card">
                  <Calendar size={18} className="text-emerald" />
                  <div>
                    <div className="free-day-label">Internal Free Day</div>
                    <div className="free-day-value">{freeDay ? freeDay : 'Verified Free'}</div>
                  </div>
                </div>
              )}

              <div className="workload-card">
                <Award size={18} className="text-indigo" />
                <div>
                  <div className="workload-label">Total Workload</div>
                  <div className="workload-value">{teacherSessions.length} Sessions / Week</div>
                </div>
              </div>
            </div>
          </div>

          <div className="preferences-bar">
            <h4><Award size={16} /> Top 3 Time Slot & Facility Preferences:</h4>
            <div className="pref-chips">
              {teacher.preferences.map((p, idx) => (
                <span key={idx} className="pref-chip">
                  <strong>Pref {idx + 1}:</strong> {p.day} • {p.timeSlot} • <em>({p.facility})</em>
                </span>
              ))}
            </div>
          </div>

          <div className="timetable-matrix-wrapper">
            <table className="timetable-grid">
              <thead>
                <tr>
                  <th className="corner-cell">Day / Time</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot} className="time-header">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => {
                  const isFree = teacher.type === 'Internal' && day === freeDay;
                  const dayLoad = dailyLoadMap[day];

                  return (
                    <tr key={day} className={isFree ? 'free-day-row' : ''}>
                      <td className="day-cell">
                        <div>
                          <strong>{day}</strong>
                          {isFree ? (
                            <span className="badge-free-day"><CheckCircle2 size={12} /> DEDICATED FREE DAY</span>
                          ) : (
                            <span className="load-pill">
                              {dayLoad.theory} Theory, {dayLoad.practical} Lab
                            </span>
                          )}
                        </div>
                      </td>

                      {TIME_SLOTS.map(slot => {
                        const session = teacherSessions.find(
                          s => s.day === day && s.timeSlot === slot
                        );

                        if (isFree) {
                          return (
                            <td key={slot} className="slot-cell free-slot-cell">
                              <div className="free-slot-content">No Classes (Free Day)</div>
                            </td>
                          );
                        }

                        return (
                          <td key={slot} className="slot-cell">
                            {session ? (
                              <div className={`session-card ${session.type === 'Theory' ? 'session-theory' : 'session-lab'}`}>
                                <div className="session-header">
                                  <span className="session-code">{session.subjectCode}</span>
                                  <span className={`session-type ${session.type === 'Theory' ? 'type-th' : 'type-pr'}`}>
                                    {session.type}
                                  </span>
                                </div>
                                <div className="session-name">{session.subjectName}</div>
                                <div className="session-meta">
                                  <span>{session.program} Sem {session.semester}</span>
                                  <span>📍 {session.roomName}</span>
                                </div>
                                {session.isPreferenceSatisfied && (
                                  <div className="pref-satisfied-tag">⭐ Preference Matched</div>
                                )}
                              </div>
                            ) : (
                              <div className="empty-slot">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
