# 📅 Academic Routine & Timetable Scheduler

An intelligent, constraint-satisfaction scheduling system and web dashboard designed for educational institutions. Built with **React 19**, **TypeScript**, and **Vite**, this tool automates the complex task of generating collision-free academic timetables while respecting hard constraints (e.g., room capacities, teacher load limits, mandatory free days) and optimizing soft constraints (e.g., faculty time slot preferences).

---

## 🚀 Features

### ⚡ Smart Backtracking Solver Engine
- **MRV (Most Restricted Variable) Heuristic**: Prioritizes scheduling complex items first—such as practical lab sessions requiring specialized rooms and subjects taught by external guest faculty.
- **Sub-second Performance**: Executes complex constraint solving in milliseconds directly in the browser environment.

### 🛡️ Strict Hard Constraint Enforcement
1. **Zero Teacher Collisions**: Prevents double-booking any instructor across multiple rooms or batches at the same time slot.
2. **Zero Room Collisions**: Ensures a room or lab is assigned to at most one class per time slot.
3. **Zero Batch Collisions**: Protects student cohorts (e.g., *B.Tech Sem 2*) from overlapping lecture schedules.
4. **Teacher Daily Load Cap**: Enforces a strict limit of **maximum 1 theory lecture per day** per instructor, and **maximum 2 total sessions/day** to prevent faculty burnout.
5. **Guaranteed Internal Faculty Free Day**: Automatically allocates at least **one full work-free day per week** (Mon–Sat) for every internal full-time faculty member.
6. **Facility & Room Type Matching**: Matches required teaching facilities (e.g., *Blackboard*, *Projector*, or *Both*) with appropriate room capabilities, ensuring practical labs occur exclusively in dedicated lab rooms.

### 🎯 Soft Constraint & Preference Optimization
- Evaluates teacher top-3 preferred time slots and facility preferences.
- Calculates an aggregate **Preference Satisfaction Rate (%)** for transparent scheduling quality evaluation.

### 📊 Comprehensive Analytics & Validation Dashboard
- **Real-Time Constraint Auditing**: Instantly detects and lists rule violations with severity markers (*Error* vs. *Warning*).
- **Metric Highlights**: Displays preference satisfaction rate, solver compute duration (ms), total theory/practical sessions breakdown, and faculty distribution.

### 📅 Multi-View Master Dashboard
- **Master Timetable Grid**: Interactive schedule matrix filterable by Room, Program (B.Tech, M.Tech, M.Sc), and Day of the week.
- **Faculty Schedule View**: Per-teacher timetable view displaying assigned classes, preference alignment status, and assigned weekly free day.
- **Dataset Hub**: In-app management interface to add, edit, or remove Subjects, Teachers, and Rooms dynamically.
- **CSV Data Operations**: Export fully formatted timetable schedules to CSV with a single click.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript 6.0, Vite 8
- **UI & Iconography**: Lucide React Icons, Custom Glassmorphism CSS Architecture
- **Code Quality**: Oxlint
- **Build System**: Vite, TypeScript Compiler (`tsc`)

---

## 📂 Project Architecture

```plain
routine-scheduling/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── AnalyticsDashboard.tsx   # Analytics, metrics & compliance reporting
│   │   ├── DatasetHub.tsx           # Dataset management (Subjects, Teachers, Rooms)
│   │   ├── Header.tsx               # Top navigation & quick actions
│   │   ├── TeacherScheduleView.tsx  # Dedicated faculty schedule & free day view
│   │   └── TimetableGrid.tsx        # Interactive master timetable matrix
│   ├── data/               # Default seed datasets
│   │   ├── initialRooms.ts          # Seed room & lab definitions
│   │   ├── initialSubjects.ts       # Seed course curriculum & session counts
│   │   └── initialTeachers.ts       # Seed faculty list & slot preferences
│   ├── types/              # Strongly typed TypeScript interfaces
│   │   └── timetable.ts             # Data models for Solver, Schedules, Constraints
│   ├── utils/              # Solver logic, validation algorithms & exporters
│   │   ├── csvExporter.ts           # CSV export utility
│   │   ├── solver.ts                # Backtracking solver with MRV heuristics
│   │   └── validator.ts             # Constraint validation engine
│   ├── App.tsx             # Root application component & state management
│   ├── index.css           # Global design system & Glassmorphic CSS variables
│   └── main.tsx            # Application entry point
├── package.json            # Dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

---

## 🧮 Algorithm Overview

The scheduling algorithm uses a **Backtracking Constraint Satisfaction Problem (CSP)** solver enhanced with heuristic ordering:

$$\text{Preference Score} = 100 - (\text{Preference Rank} \times 20) + \text{Facility Bonus}$$

1. **Ordering Phase**: Sessions are sorted so that practical labs and external faculty subjects are evaluated first (Highest Constrained Rank).
2. **Free Day Allocation**: Internal teachers are assigned an optimal non-preferred day as their guaranteed weekly free day.
3. **Candidate Selection**: For each session, candidate (Day, TimeSlot, Room) tuples are generated, validated against hard constraints, and sorted by preference score.
4. **Recursive Backtracking**: The solver attempts placement along highest-scoring candidates, rewinding assignments cleanly if a constraint wall is hit.

---

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js (v18 or higher)** and **npm** installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mathsphile/routine-scheduling.git
   cd routine-scheduling
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to view the app.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📄 License

This project is open-source and available under the **MIT License**.
