import React, { useState } from 'react';
import type { Subject, Teacher, Room, ProgramType, ClassType, Facility } from '../types/timetable';
import { BookOpen, Users, DoorClosed, Plus, Trash2, RotateCcw, Download } from 'lucide-react';
import { exportSubjectsCSV, exportTeachersCSV } from '../utils/csvExporter';

interface DatasetHubProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onResetDatasets: () => void;
}

export const DatasetHub: React.FC<DatasetHubProps> = ({
  subjects,
  setSubjects,
  teachers,
  setTeachers,
  rooms,
  setRooms,
  onResetDatasets
}) => {
  const [subTab, setSubTab] = useState<'subjects' | 'teachers' | 'rooms'>('subjects');

  // Form states for adding new items
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubProg, setNewSubProg] = useState<ProgramType>('B.Tech');
  const [newSubSem, setNewSubSem] = useState<number>(1);
  const [newSubType, setNewSubType] = useState<ClassType>('Theory');
  const [newSubTeacher, setNewSubTeacher] = useState<string>(teachers[0]?.id || '');
  const [newSubFacility, setNewSubFacility] = useState<Facility>('Blackboard & Projector');
  const [newSubSessions, setNewSubSessions] = useState<number>(2);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    const newSub: Subject = {
      id: `SUB-CUSTOM-${Date.now()}`,
      code: newSubCode,
      name: newSubName,
      program: newSubProg,
      semester: Number(newSubSem),
      type: newSubType,
      teacherId: newSubTeacher,
      requiredFacility: newSubFacility,
      sessionsPerWeek: Number(newSubSessions)
    };

    setSubjects([...subjects, newSub]);
    setNewSubCode('');
    setNewSubName('');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <div className="dataset-hub-container">
      <div className="dataset-hub-header">
        <div>
          <h2 className="section-title">Department Dataset Management</h2>
          <p className="section-subtitle">Manage CS Department Courses, Faculty Preferences, and Room Facilities</p>
        </div>

        <div className="hub-actions">
          <button className="btn btn-outline" onClick={onResetDatasets}>
            <RotateCcw size={16} /> Reset Default Datasets
          </button>

          {subTab === 'subjects' && (
            <button className="btn btn-secondary" onClick={() => exportSubjectsCSV(subjects)}>
              <Download size={16} /> Export Subjects CSV
            </button>
          )}

          {subTab === 'teachers' && (
            <button className="btn btn-secondary" onClick={() => exportTeachersCSV(teachers)}>
              <Download size={16} /> Export Teachers CSV
            </button>
          )}
        </div>
      </div>

      <div className="sub-nav-tabs">
        <button
          className={`sub-tab ${subTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setSubTab('subjects')}
        >
          <BookOpen size={16} /> Subjects & Teachers Assigned ({subjects.length})
        </button>
        <button
          className={`sub-tab ${subTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setSubTab('teachers')}
        >
          <Users size={16} /> Faculty Profiles & Preferred Slots ({teachers.length})
        </button>
        <button
          className={`sub-tab ${subTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setSubTab('rooms')}
        >
          <DoorClosed size={16} /> Classrooms & Labs ({rooms.length})
        </button>
      </div>

      {subTab === 'subjects' && (
        <div className="dataset-section">
          <form className="add-form-card" onSubmit={handleAddSubject}>
            <h3><Plus size={18} /> Add New Subject Course</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Code (e.g. CS504)"
                value={newSubCode}
                onChange={e => setNewSubCode(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                required
              />
              <select value={newSubProg} onChange={e => setNewSubProg(e.target.value as ProgramType)}>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="M.Sc">M.Sc</option>
              </select>
              <select value={newSubSem} onChange={e => setNewSubSem(Number(e.target.value))}>
                <option value={1}>Sem 1</option>
                <option value={3}>Sem 3</option>
                <option value={5}>Sem 5</option>
                <option value={7}>Sem 7</option>
              </select>
              <select value={newSubType} onChange={e => setNewSubType(e.target.value as ClassType)}>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
              <select value={newSubTeacher} onChange={e => setNewSubTeacher(e.target.value)}>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
              <select value={newSubFacility} onChange={e => setNewSubFacility(e.target.value as Facility)}>
                <option value="Blackboard">Blackboard</option>
                <option value="Projector">Projector</option>
                <option value="Blackboard & Projector">Blackboard & Projector</option>
              </select>
              <input
                type="number"
                min={1}
                max={4}
                value={newSubSessions}
                onChange={e => setNewSubSessions(Number(e.target.value))}
                placeholder="Sessions/Week"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Add Subject</button>
          </form>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Program & Sem</th>
                  <th>Type</th>
                  <th>Assigned Faculty</th>
                  <th>Facility Req.</th>
                  <th>Sessions/Wk</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => {
                  const teacher = teachers.find(t => t.id === sub.teacherId);
                  return (
                    <tr key={sub.id}>
                      <td><span className="code-tag">{sub.code}</span></td>
                      <td><strong>{sub.name}</strong></td>
                      <td>{sub.program} Sem {sub.semester}</td>
                      <td>
                        <span className={`type-badge ${sub.type === 'Theory' ? 'badge-blue' : 'badge-purple'}`}>
                          {sub.type}
                        </span>
                      </td>
                      <td>
                        {teacher ? (
                          <span>
                            {teacher.name} <small className="text-muted">({teacher.type})</small>
                          </span>
                        ) : 'Unassigned'}
                      </td>
                      <td><span className="facility-pill">{sub.requiredFacility}</span></td>
                      <td>{sub.sessionsPerWeek}</td>
                      <td>
                        <button className="btn-icon-danger" onClick={() => handleDeleteSubject(sub.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'teachers' && (
        <div className="dataset-section">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Designation</th>
                  <th>Preference 1 (Day / Slot / Facility)</th>
                  <th>Preference 2</th>
                  <th>Preference 3</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id}>
                    <td><span className="code-tag">{t.id}</span></td>
                    <td><strong>{t.name}</strong></td>
                    <td>
                      <span className={`type-badge ${t.type === 'Internal' ? 'badge-green' : 'badge-orange'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.designation}</td>
                    <td>
                      <div className="pref-box">
                        <strong>{t.preferences[0].day}</strong> ({t.preferences[0].timeSlot})
                        <small>{t.preferences[0].facility}</small>
                      </div>
                    </td>
                    <td>
                      <div className="pref-box">
                        <strong>{t.preferences[1].day}</strong> ({t.preferences[1].timeSlot})
                        <small>{t.preferences[1].facility}</small>
                      </div>
                    </td>
                    <td>
                      <div className="pref-box">
                        <strong>{t.preferences[2].day}</strong> ({t.preferences[2].timeSlot})
                        <small>{t.preferences[2].facility}</small>
                      </div>
                    </td>
                    <td>
                      <button className="btn-icon-danger" onClick={() => handleDeleteTeacher(t.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'rooms' && (
        <div className="dataset-section">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Facility Available</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(r => (
                  <tr key={r.id}>
                    <td><span className="code-tag">{r.id}</span></td>
                    <td><strong>{r.name}</strong></td>
                    <td>
                      <span className={`type-badge ${r.type === 'Lab' ? 'badge-purple' : r.type === 'Seminar Hall' ? 'badge-orange' : 'badge-blue'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td><span className="facility-pill">{r.facility}</span></td>
                    <td>{r.capacity} seats</td>
                    <td>
                      <button className="btn-icon-danger" onClick={() => handleDeleteRoom(r.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
