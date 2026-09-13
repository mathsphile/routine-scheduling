import React, { useState } from 'react';
import type { ScheduledSession, ProgramType, DayOfWeek, TimeSlot, Room } from '../types/timetable';
import { Calendar, Filter, DoorClosed, BookOpen, Layers } from 'lucide-react';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS: TimeSlot[] = ['10:00 - 12:00', '12:00 - 02:00', '02:30 - 04:30'];

interface TimetableGridProps {
  schedule: ScheduledSession[];
  rooms: Room[];
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ schedule, rooms }) => {
  const [viewMode, setViewMode] = useState<'semester' | 'room' | 'master'>('semester');
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('B.Tech');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  // Filter schedule based on mode
  const filteredSchedule = schedule.filter(s => {
    if (viewMode === 'semester') {
      return s.program === selectedProgram && s.semester === selectedSemester;
    }
    if (viewMode === 'room') {
      return s.roomId === selectedRoomId;
    }
    return true; // master
  });

  return (
    <div className="timetable-container">
      <div className="timetable-header-bar">
        <div className="view-mode-tabs">
          <button
            className={`mode-btn ${viewMode === 'semester' ? 'active' : ''}`}
            onClick={() => setViewMode('semester')}
          >
            <BookOpen size={16} /> Semester Batch View
          </button>
          <button
            className={`mode-btn ${viewMode === 'room' ? 'active' : ''}`}
            onClick={() => setViewMode('room')}
          >
            <DoorClosed size={16} /> Room Schedule View
          </button>
          <button
            className={`mode-btn ${viewMode === 'master' ? 'active' : ''}`}
            onClick={() => setViewMode('master')}
          >
            <Layers size={16} /> Department Master Matrix
          </button>
        </div>

        <div className="filter-controls">
          {viewMode === 'semester' && (
            <>
              <div className="filter-group">
                <label><Filter size={14} /> Program:</label>
                <select
                  value={selectedProgram}
                  onChange={e => setSelectedProgram(e.target.value as ProgramType)}
                >
                  <option value="B.Tech">B.Tech (CS)</option>
                  <option value="M.Tech">M.Tech (CS)</option>
                  <option value="M.Sc">M.Sc (CS)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Semester:</label>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(Number(e.target.value))}
                >
                  {selectedProgram === 'B.Tech' && (
                    <>
                      <option value={1}>Semester 1</option>
                      <option value={3}>Semester 3</option>
                      <option value={5}>Semester 5</option>
                      <option value={7}>Semester 7</option>
                    </>
                  )}
                  {(selectedProgram === 'M.Tech' || selectedProgram === 'M.Sc') && (
                    <>
                      <option value={1}>Semester 1</option>
                      <option value={3}>Semester 3</option>
                    </>
                  )}
                </select>
              </div>
            </>
          )}

          {viewMode === 'room' && (
            <div className="filter-group">
              <label><DoorClosed size={14} /> Select Room:</label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(e.target.value)}
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type} • {r.facility})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="timetable-title-badge">
        <Calendar size={18} />
        {viewMode === 'semester' && (
          <span>Class Timetable: <strong>{selectedProgram} — Semester {selectedSemester}</strong></span>
        )}
        {viewMode === 'room' && (
          <span>Room Utilization: <strong>{rooms.find(r => r.id === selectedRoomId)?.name}</strong></span>
        )}
        {viewMode === 'master' && (
          <span>CS Department Master Schedule Grid (All Semesters & Rooms)</span>
        )}
      </div>

      <div className="timetable-matrix-wrapper">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th className="corner-cell">Day / Time Slot</th>
              {TIME_SLOTS.map(slot => (
                <th key={slot} className="time-header">{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="day-cell">
                  <strong>{day}</strong>
                </td>

                {TIME_SLOTS.map(slot => {
                  const sessionsInSlot = filteredSchedule.filter(
                    s => s.day === day && s.timeSlot === slot
                  );

                  return (
                    <td key={slot} className="slot-cell">
                      {sessionsInSlot.length > 0 ? (
                        <div className="sessions-list">
                          {sessionsInSlot.map(s => (
                            <div
                              key={s.id}
                              className={`session-card ${s.type === 'Theory' ? 'session-theory' : 'session-lab'}`}
                            >
                              <div className="session-header">
                                <span className="session-code">{s.subjectCode}</span>
                                <span className={`session-type ${s.type === 'Theory' ? 'type-th' : 'type-pr'}`}>
                                  {s.type}
                                </span>
                              </div>
                              <div className="session-name">{s.subjectName}</div>
                              <div className="session-meta">
                                <span>👨‍🏫 {s.teacherName} <small>({s.teacherType})</small></span>
                                <span>📍 {s.roomName}</span>
                              </div>
                              {viewMode === 'master' && (
                                <div className="batch-pill">
                                  {s.program} Sem {s.semester}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-slot">Free Slot</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
