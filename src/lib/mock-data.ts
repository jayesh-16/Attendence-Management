
import { Class, Student, AttendanceRecord, AttendanceStats } from "@/types";
import { format, subDays } from "date-fns";

// Generate mock students
const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `student-${i + 1}`,
    name: [
      "Olivia Johnson",
      "Ethan Williams",
      "Sophia Lee",
      "Noah Garcia",
      "Isabella Martinez",
      "Liam Rodriguez",
      "Ava Wilson",
      "Mason Brown",
      "Emma Davis",
      "Jacob Taylor",
      "Charlotte Thomas",
      "Michael Hernandez",
      "Amelia Moore",
      "Alexander Clark",
      "Mia Lewis",
      "James Allen",
      "Harper Young",
      "Benjamin Walker",
      "Evelyn Hall",
      "Lucas Wright",
      "Abigail Hill",
      "Logan Green",
      "Emily Adams",
      "Daniel King",
      "Elizabeth Baker",
    ][i % 25],
    studentId: `SID${(100000 + i).toString()}`,
    email: `student${i + 1}@school.edu`,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      [
        "Olivia Johnson",
        "Ethan Williams",
        "Sophia Lee",
        "Noah Garcia",
        "Isabella Martinez",
        "Liam Rodriguez",
        "Ava Wilson",
        "Mason Brown",
        "Emma Davis",
        "Jacob Taylor",
        "Charlotte Thomas",
        "Michael Hernandez",
        "Amelia Moore",
        "Alexander Clark",
        "Mia Lewis",
        "James Allen",
        "Harper Young",
        "Benjamin Walker",
        "Evelyn Hall",
        "Lucas Wright",
        "Abigail Hill",
        "Logan Green",
        "Emily Adams",
        "Daniel King",
        "Elizabeth Baker",
      ][i % 25]
    )}&background=random`,
  }));
};

// Generate mock classes
export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Mathematics 101",
    description: "Introductory mathematics course covering algebra and geometry",
    schedule: "Monday, Wednesday, Friday - 9:00 AM to 10:30 AM",
    grade: "9th Grade",
    students: generateStudents(24),
  },
  {
    id: "class-2",
    name: "English Literature",
    description: "Study of classic literature and composition",
    schedule: "Tuesday, Thursday - 11:00 AM to 12:30 PM",
    grade: "10th Grade",
    students: generateStudents(21),
  },
  {
    id: "class-3",
    name: "Physics",
    description: "Introduction to mechanics and thermodynamics",
    schedule: "Monday, Wednesday - 1:00 PM to 2:30 PM",
    grade: "11th Grade",
    students: generateStudents(18),
  },
  {
    id: "class-4",
    name: "Chemistry",
    description: "General chemistry principles and lab work",
    schedule: "Tuesday, Thursday - 2:00 PM to 3:30 PM",
    grade: "11th Grade",
    students: generateStudents(20),
  },
  {
    id: "class-5",
    name: "World History",
    description: "Survey of global historical events and civilizations",
    schedule: "Monday, Wednesday, Friday - 10:45 AM to 11:45 AM",
    grade: "10th Grade",
    students: generateStudents(23),
  },
];

// Generate attendance statuses with appropriate distribution
const generateAttendanceStatus = (studentIndex: number, dayOffset: number) => {
  // Create a deterministic but varied pattern
  const seed = (studentIndex * 3 + dayOffset * 7) % 100;
  
  if (seed < 85) return "present";  // 85% present
  if (seed < 92) return "absent";   // 7% absent
  if (seed < 97) return "late";     // 5% late
  return "excused";                 // 3% excused
};

// Generate attendance records for the past 30 days
export const generateAttendanceRecords = (classId: string, students: Student[]) => {
  const records: AttendanceRecord[] = [];
  
  for (let day = 0; day < 30; day++) {
    const date = format(subDays(new Date(), day), "yyyy-MM-dd");
    
    // Skip weekends (Saturday and Sunday)
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    students.forEach((student, index) => {
      const status = generateAttendanceStatus(index, day) as "present" | "absent" | "late" | "excused";
      records.push({
        date,
        studentId: student.id,
        status,
        note: status !== "present" ? `Auto-generated ${status} record` : undefined,
      });
    });
  }
  
  return records;
};

// Helper to calculate attendance statistics
export const calculateAttendanceStats = (records: AttendanceRecord[]): AttendanceStats => {
  const stats = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: records.length,
  };
  
  records.forEach(record => {
    stats[record.status]++;
  });
  
  return stats;
};

// Get attendance for a specific class and date
export const getAttendanceForDate = (classId: string, date: string) => {
  const classData = mockClasses.find(c => c.id === classId);
  if (!classData) return [];
  
  const records = generateAttendanceRecords(classId, classData.students);
  return records.filter(record => record.date === date);
};

// Get students with their attendance for a specific class and date
export const getStudentsWithAttendance = (classId: string, date: string) => {
  const classData = mockClasses.find(c => c.id === classId);
  if (!classData) return [];
  
  const attendanceRecords = generateAttendanceRecords(classId, classData.students);
  const dateRecords = attendanceRecords.filter(record => record.date === date);
  
  return classData.students.map(student => {
    const record = dateRecords.find(r => r.studentId === student.id);
    return {
      student,
      status: record?.status || "absent",
      note: record?.note,
    };
  });
};
