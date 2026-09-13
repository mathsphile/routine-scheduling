import { useState, useEffect } from 'react';
import { initialSubjects } from './data/initialSubjects';
import { initialTeachers } from './data/initialTeachers';
import { initialRooms } from './data/initialRooms';
import type { Subject, Teacher, Room, SolverResult } from './types/timetable';
import { solveTimetable } from './utils/solver';
import { exportTimetableCSV } from './utils/csvExporter';
import { Header } from './components/Header';
import { TimetableGrid } from './components/TimetableGrid';
import { TeacherScheduleView } from './components/TeacherScheduleView';
import { DatasetHub } from './components/DatasetHub';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export function App() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const [activeTab, setActiveTab] = useState<'timetable' | 'datasets' | 'teachers' | 'analytics'>('timetable');
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);

  const handleRunSolver = () => {
    setIsSolving(true);
    setTimeout(() => {
      const result = solveTimetable(subjects, teachers, rooms);
      setSolverResult(result);
      setIsSolving(false);
    }, 100);
  };

  useEffect(() => {
    // Run solver automatically on initial render
    handleRunSolver();
  }, [subjects, teachers, rooms]);

  const handleResetDatasets = () => {
    setSubjects(initialSubjects);
    setTeachers(initialTeachers);
    setRooms(initialRooms);
  };

  const handleExportCSV = () => {
    if (solverResult && solverResult.schedule) {
      exportTimetableCSV(solverResult.schedule);
    }
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        solverResult={solverResult}
        onSolve={handleRunSolver}
        onExportCSV={handleExportCSV}
        isSolving={isSolving}
      />

      <main className="app-main-content">
        {activeTab === 'timetable' && solverResult && (
          <TimetableGrid schedule={solverResult.schedule} rooms={rooms} />
        )}

        {activeTab === 'teachers' && solverResult && (
          <TeacherScheduleView
            teachers={teachers}
            schedule={solverResult.schedule}
            freeDaysMap={solverResult.internalTeachersFreeDays}
          />
        )}

        {activeTab === 'datasets' && (
          <DatasetHub
            subjects={subjects}
            setSubjects={setSubjects}
            teachers={teachers}
            setTeachers={setTeachers}
            rooms={rooms}
            setRooms={setRooms}
            onResetDatasets={handleResetDatasets}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard solverResult={solverResult} teachers={teachers} />
        )}
      </main>
    </div>
  );
}

export default App;
