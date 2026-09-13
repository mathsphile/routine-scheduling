import type { Room } from '../types/timetable';

export const initialRooms: Room[] = [
  {
    id: 'R-101',
    name: 'CS Lecture Hall 101',
    type: 'Classroom',
    facility: 'Blackboard & Projector',
    capacity: 75
  },
  {
    id: 'R-102',
    name: 'CS Lecture Hall 102',
    type: 'Classroom',
    facility: 'Blackboard & Projector',
    capacity: 75
  },
  {
    id: 'R-103',
    name: 'CS Classroom 103',
    type: 'Classroom',
    facility: 'Blackboard',
    capacity: 60
  },
  {
    id: 'R-104',
    name: 'CS Classroom 104',
    type: 'Classroom',
    facility: 'Projector',
    capacity: 60
  },
  {
    id: 'R-201',
    name: 'PG Classroom 201 (M.Tech)',
    type: 'Classroom',
    facility: 'Blackboard & Projector',
    capacity: 40
  },
  {
    id: 'R-202',
    name: 'PG Classroom 202 (M.Sc)',
    type: 'Classroom',
    facility: 'Blackboard & Projector',
    capacity: 40
  },
  {
    id: 'LAB-1',
    name: 'Software Engineering Lab',
    type: 'Lab',
    facility: 'Blackboard & Projector',
    capacity: 50
  },
  {
    id: 'LAB-2',
    name: 'AI & Data Science Lab',
    type: 'Lab',
    facility: 'Blackboard & Projector',
    capacity: 50
  },
  {
    id: 'LAB-3',
    name: 'Systems & Networking Lab',
    type: 'Lab',
    facility: 'Projector',
    capacity: 40
  },
  {
    id: 'SEM-HALL',
    name: 'Turing Seminar Hall',
    type: 'Seminar Hall',
    facility: 'Blackboard & Projector',
    capacity: 150
  }
];
