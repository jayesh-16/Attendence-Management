
export interface Student {
  id: string;
  name: string;
  avatarUrl?: string;
  studentId: string;
  email: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  grade: string;
  students: Student[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceData {
  classId: string;
  date: string;
  records: AttendanceRecord[];
}

export interface DateAttendance {
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendance {
  student: Student;
  records: DateAttendance[];
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}
