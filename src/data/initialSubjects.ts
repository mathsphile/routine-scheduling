import type { Subject } from '../types/timetable';

export const initialSubjects: Subject[] = [
  // ================= B.TECH SEMESTER 1 =================
  {
    id: 'SUB-BT1-01',
    code: 'CS101',
    name: 'Introduction to Programming (Theory)',
    program: 'B.Tech',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_INT_101', // Turing
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT1-02',
    code: 'CS191',
    name: 'C Programming Lab (Practical)',
    program: 'B.Tech',
    semester: 1,
    type: 'Practical',
    teacherId: 'T_INT_110', // Thompson
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },
  {
    id: 'SUB-BT1-03',
    code: 'MA101',
    name: 'Discrete Mathematics',
    program: 'B.Tech',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_INT_104', // Knuth
    requiredFacility: 'Blackboard',
    sessionsPerWeek: 2
  },

  // ================= B.TECH SEMESTER 3 =================
  {
    id: 'SUB-BT3-01',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    program: 'B.Tech',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_105', // Dijkstra
    requiredFacility: 'Blackboard',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT3-02',
    code: 'CS391',
    name: 'Data Structures Lab',
    program: 'B.Tech',
    semester: 3,
    type: 'Practical',
    teacherId: 'T_INT_105', // Dijkstra (can have 1 theory + 1 practical on same day)
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },
  {
    id: 'SUB-BT3-03',
    code: 'CS302',
    name: 'Computer Organization & Architecture',
    program: 'B.Tech',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_103', // Hopper
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT3-04',
    code: 'CS303',
    name: 'Object-Oriented Programming with Java',
    program: 'B.Tech',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_106', // Liskov
    requiredFacility: 'Projector',
    sessionsPerWeek: 2
  },

  // ================= B.TECH SEMESTER 5 =================
  {
    id: 'SUB-BT5-01',
    code: 'CS501',
    name: 'Operating Systems',
    program: 'B.Tech',
    semester: 5,
    type: 'Theory',
    teacherId: 'T_INT_109', // Tanenbaum
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT5-02',
    code: 'CS591',
    name: 'Operating Systems & Linux Lab',
    program: 'B.Tech',
    semester: 5,
    type: 'Practical',
    teacherId: 'T_EXT_201', // Torvalds (External)
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },
  {
    id: 'SUB-BT5-03',
    code: 'CS502',
    name: 'Database Management Systems',
    program: 'B.Tech',
    semester: 5,
    type: 'Theory',
    teacherId: 'T_INT_102', // Lovelace
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT5-04',
    code: 'CS503',
    name: 'Computer Networks',
    program: 'B.Tech',
    semester: 5,
    type: 'Theory',
    teacherId: 'T_INT_107', // Berners-Lee
    requiredFacility: 'Projector',
    sessionsPerWeek: 2
  },

  // ================= B.TECH SEMESTER 7 =================
  {
    id: 'SUB-BT7-01',
    code: 'CS701',
    name: 'Compiler Design',
    program: 'B.Tech',
    semester: 7,
    type: 'Theory',
    teacherId: 'T_INT_103', // Hopper
    requiredFacility: 'Blackboard',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT7-02',
    code: 'CS702',
    name: 'Machine Learning',
    program: 'B.Tech',
    semester: 7,
    type: 'Theory',
    teacherId: 'T_EXT_202', // LeCun (External)
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-BT7-03',
    code: 'CS791',
    name: 'AI & Machine Learning Lab',
    program: 'B.Tech',
    semester: 7,
    type: 'Practical',
    teacherId: 'T_EXT_203', // Hinton (External)
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },

  // ================= M.TECH SEMESTER 1 =================
  {
    id: 'SUB-MT1-01',
    code: 'CSM101',
    name: 'Advanced Data Structures & Algorithms',
    program: 'M.Tech',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_INT_104', // Knuth
    requiredFacility: 'Blackboard',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MT1-02',
    code: 'CSM102',
    name: 'Distributed Systems & Cloud Computing',
    program: 'M.Tech',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_INT_108', // Lamport
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MT1-03',
    code: 'CSM191',
    name: 'Cloud Computing Lab',
    program: 'M.Tech',
    semester: 1,
    type: 'Practical',
    teacherId: 'T_INT_108', // Lamport
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },

  // ================= M.TECH SEMESTER 3 =================
  {
    id: 'SUB-MT3-01',
    code: 'CSM301',
    name: 'Deep Learning & Neural Networks',
    program: 'M.Tech',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_EXT_203', // Hinton (External)
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MT3-02',
    code: 'CSM302',
    name: 'Quantum Computing & Cryptography',
    program: 'M.Tech',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_101', // Turing
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  },

  // ================= M.SC SEMESTER 1 =================
  {
    id: 'SUB-MS1-01',
    code: 'CSC101',
    name: 'Theoretical Computer Science & Automata',
    program: 'M.Sc',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_INT_101', // Turing
    requiredFacility: 'Blackboard',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MS1-02',
    code: 'CSC102',
    name: 'Advanced Python Scripting',
    program: 'M.Sc',
    semester: 1,
    type: 'Theory',
    teacherId: 'T_EXT_204', // van Rossum (External)
    requiredFacility: 'Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MS1-03',
    code: 'CSC191',
    name: 'Python Lab',
    program: 'M.Sc',
    semester: 1,
    type: 'Practical',
    teacherId: 'T_EXT_204', // van Rossum (External)
    requiredFacility: 'Projector',
    sessionsPerWeek: 1
  },

  // ================= M.SC SEMESTER 3 =================
  {
    id: 'SUB-MS3-01',
    code: 'CSC301',
    name: 'Web Engineering & Microservices',
    program: 'M.Sc',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_107', // Berners-Lee
    requiredFacility: 'Projector',
    sessionsPerWeek: 2
  },
  {
    id: 'SUB-MS3-02',
    code: 'CSC302',
    name: 'Software Testing & Quality Assurance',
    program: 'M.Sc',
    semester: 3,
    type: 'Theory',
    teacherId: 'T_INT_106', // Liskov
    requiredFacility: 'Blackboard & Projector',
    sessionsPerWeek: 2
  }
];
