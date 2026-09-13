import React from 'react';
import { Calendar, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Download, Database, Layers, UserCheck } from 'lucide-react';
import type { SolverResult } from '../types/timetable';

interface HeaderProps {
  activeTab: 'timetable' | 'datasets' | 'teachers' | 'analytics';
  setActiveTab: (tab: 'timetable' | 'datasets' | 'teachers' | 'analytics') => void;
  solverResult: SolverResult | null;
  onSolve: () => void;
  onExportCSV: () => void;
  isSolving: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  solverResult,
  onSolve,
  onExportCSV,
  isSolving
}) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-logo">
            <Cpu className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">CS Dept Timetable Studio</h1>
            <p className="brand-subtitle">Computer Science & Engineering • Automated CSP Solver</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className={`btn btn-primary ${isSolving ? 'spinning' : ''}`}
            onClick={onSolve}
            disabled={isSolving}
          >
            <RefreshCw className="btn-icon" />
            {isSolving ? 'Solving Timetable...' : 'Re-Generate Timetable'}
          </button>

          <button className="btn btn-secondary" onClick={onExportCSV}>
            <Download className="btn-icon" />
            Export CSV
          </button>
        </div>
      </div>

      {solverResult && (
        <div className="stats-banner">
          <div className="stat-card stat-success">
            <CheckCircle2 className="stat-icon" />
            <div>
              <div className="stat-value">{solverResult.stats.totalSessions}</div>
              <div className="stat-label">Scheduled Sessions</div>
            </div>
          </div>

          <div className="stat-card">
            <Layers className="stat-icon text-indigo" />
            <div>
              <div className="stat-value">{solverResult.stats.totalTheory} Theory / {solverResult.stats.totalPractical} Lab</div>
              <div className="stat-label">Classes Breakup</div>
            </div>
          </div>

          <div className="stat-card">
            <UserCheck className="stat-icon text-cyan" />
            <div>
              <div className="stat-value">100% Free Days</div>
              <div className="stat-label">{solverResult.stats.internalTeacherCount} Internal Teachers Verified</div>
            </div>
          </div>

          <div className="stat-card">
            <Cpu className="stat-icon text-emerald" />
            <div>
              <div className="stat-value">{solverResult.preferenceSatisfactionRate}%</div>
              <div className="stat-label">Teacher Preference Match</div>
            </div>
          </div>

          <div className="stat-card">
            <div className={`status-badge ${solverResult.violations.length === 0 ? 'badge-green' : 'badge-red'}`}>
              {solverResult.violations.length === 0 ? (
                <>
                  <CheckCircle2 size={16} /> 0 Conflicts
                </>
              ) : (
                <>
                  <AlertTriangle size={16} /> {solverResult.violations.length} Conflicts
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="header-nav">
        <button
          className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          <Calendar size={18} />
          Timetable Matrix
        </button>

        <button
          className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <UserCheck size={18} />
          Teacher Schedules & Free Days
        </button>

        <button
          className={`nav-item ${activeTab === 'datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('datasets')}
        >
          <Database size={18} />
          Dataset Hub (Subjects / Teachers / Rooms)
        </button>

        <button
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Cpu size={18} />
          Constraint Verification & Rules
        </button>
      </nav>
    </header>
  );
};
