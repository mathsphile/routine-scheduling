import type { Teacher } from '../types/timetable';

export const initialTeachers: Teacher[] = [
  // INTERNAL TEACHERS
  {
    id: 'T_INT_101',
    name: 'Prof. Alan Turing',
    type: 'Internal',
    designation: 'Professor & HOD',
    preferences: [
      { day: 'Monday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Wednesday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Friday', timeSlot: '12:00 - 02:00', facility: 'Projector' }
    ]
  },
  {
    id: 'T_INT_102',
    name: 'Dr. Ada Lovelace',
    type: 'Internal',
    designation: 'Associate Professor',
    preferences: [
      { day: 'Tuesday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Thursday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Friday', timeSlot: '10:00 - 12:00', facility: 'Blackboard' }
    ]
  },
  {
    id: 'T_INT_103',
    name: 'Dr. Grace Hopper',
    type: 'Internal',
    designation: 'Associate Professor',
    preferences: [
      { day: 'Monday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Wednesday', timeSlot: '02:30 - 04:30', facility: 'Projector' },
      { day: 'Friday', timeSlot: '10:00 - 12:00', facility: 'Projector' }
    ]
  },
  {
    id: 'T_INT_104',
    name: 'Dr. Donald Knuth',
    type: 'Internal',
    designation: 'Professor',
    preferences: [
      { day: 'Tuesday', timeSlot: '12:00 - 02:00', facility: 'Blackboard' },
      { day: 'Thursday', timeSlot: '10:00 - 12:00', facility: 'Blackboard' },
      { day: 'Saturday', timeSlot: '10:00 - 12:00', facility: 'Blackboard' }
    ]
  },
  {
    id: 'T_INT_105',
    name: 'Prof. Edsger Dijkstra',
    type: 'Internal',
    designation: 'Professor',
    preferences: [
      { day: 'Monday', timeSlot: '02:30 - 04:30', facility: 'Blackboard' },
      { day: 'Wednesday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Thursday', timeSlot: '02:30 - 04:30', facility: 'Blackboard' }
    ]
  },
  {
    id: 'T_INT_106',
    name: 'Dr. Barbara Liskov',
    type: 'Internal',
    designation: 'Assistant Professor',
    preferences: [
      { day: 'Tuesday', timeSlot: '02:30 - 04:30', facility: 'Projector' },
      { day: 'Thursday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Saturday', timeSlot: '12:00 - 02:00', facility: 'Projector' }
    ]
  },
  {
    id: 'T_INT_107',
    name: 'Dr. Tim Berners-Lee',
    type: 'Internal',
    designation: 'Assistant Professor',
    preferences: [
      { day: 'Monday', timeSlot: '10:00 - 12:00', facility: 'Projector' },
      { day: 'Wednesday', timeSlot: '10:00 - 12:00', facility: 'Projector' },
      { day: 'Friday', timeSlot: '02:30 - 04:30', facility: 'Blackboard & Projector' }
    ]
  },
  {
    id: 'T_INT_108',
    name: 'Dr. Leslie Lamport',
    type: 'Internal',
    designation: 'Assistant Professor',
    preferences: [
      { day: 'Tuesday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Wednesday', timeSlot: '02:30 - 04:30', facility: 'Blackboard' },
      { day: 'Friday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' }
    ]
  },
  {
    id: 'T_INT_109',
    name: 'Dr. Andrew Tanenbaum',
    type: 'Internal',
    designation: 'Associate Professor',
    preferences: [
      { day: 'Monday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Thursday', timeSlot: '12:00 - 02:00', facility: 'Projector' },
      { day: 'Saturday', timeSlot: '10:00 - 12:00', facility: 'Projector' }
    ]
  },
  {
    id: 'T_INT_110',
    name: 'Dr. Ken Thompson',
    type: 'Internal',
    designation: 'Assistant Professor',
    preferences: [
      { day: 'Tuesday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Wednesday', timeSlot: '12:00 - 02:00', facility: 'Blackboard & Projector' },
      { day: 'Friday', timeSlot: '10:00 - 12:00', facility: 'Projector' }
    ]
  },

  // EXTERNAL TEACHERS
  {
    id: 'T_EXT_201',
    name: 'Dr. Linus Torvalds',
    type: 'External',
    designation: 'Visiting Professor (Kernel Eng.)',
    preferences: [
      { day: 'Monday', timeSlot: '02:30 - 04:30', facility: 'Projector' },
      { day: 'Wednesday', timeSlot: '02:30 - 04:30', facility: 'Blackboard & Projector' },
      { day: 'Friday', timeSlot: '02:30 - 04:30', facility: 'Projector' }
    ]
  },
  {
    id: 'T_EXT_202',
    name: 'Prof. Yann LeCun',
    type: 'External',
    designation: 'Adjunct Professor (AI/ML)',
    preferences: [
      { day: 'Tuesday', timeSlot: '02:30 - 04:30', facility: 'Blackboard & Projector' },
      { day: 'Thursday', timeSlot: '02:30 - 04:30', facility: 'Projector' },
      { day: 'Saturday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' }
    ]
  },
  {
    id: 'T_EXT_203',
    name: 'Dr. Geoffrey Hinton',
    type: 'External',
    designation: 'Guest Lecturer (Deep Learning)',
    preferences: [
      { day: 'Monday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' },
      { day: 'Wednesday', timeSlot: '10:00 - 12:00', facility: 'Projector' },
      { day: 'Friday', timeSlot: '10:00 - 12:00', facility: 'Blackboard & Projector' }
    ]
  },
  {
    id: 'T_EXT_204',
    name: 'Dr. Guido van Rossum',
    type: 'External',
    designation: 'Industry Expert (Python/Scripting)',
    preferences: [
      { day: 'Thursday', timeSlot: '12:00 - 02:00', facility: 'Projector' },
      { day: 'Friday', timeSlot: '02:30 - 04:30', facility: 'Projector' },
      { day: 'Saturday', timeSlot: '12:00 - 02:00', facility: 'Projector' }
    ]
  }
];
