
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { AttendanceRecord, Class, Student } from "@/types";

interface StudentReportListProps {
  classData: Class;
  attendanceRecords: AttendanceRecord[];
}

const StudentReportList = ({ classData, attendanceRecords }: StudentReportListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter and group attendance records by student
  const studentRecords = classData.students
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(student => {
      const records = attendanceRecords.filter(record => record.studentId === student.id);
      
      // Calculate statistics
      const total = records.length || 1; // Avoid division by zero
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;
      const excused = records.filter(r => r.status === 'excused').length;
      
      const presentPercentage = Math.round((present / total) * 100);
      
      return {
        student,
        presentPercentage,
        absentCount: absent,
        lateCount: late,
        excusedCount: excused,
      };
    })
    .sort((a, b) => b.presentPercentage - a.presentPercentage);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Student Attendance Report</CardTitle>
            <CardDescription>Detailed student attendance statistics</CardDescription>
          </div>
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Attendance Rate</TableHead>
              <TableHead className="hidden md:table-cell">Absences</TableHead>
              <TableHead className="hidden md:table-cell">Late</TableHead>
              <TableHead className="hidden md:table-cell">Excused</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentRecords.map(({ student, presentPercentage, absentCount, lateCount, excusedCount }) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatarUrl} alt={student.name} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all"
                        style={{ 
                          width: `${presentPercentage}%`,
                          backgroundColor: presentPercentage > 90 
                            ? "#10b981" 
                            : presentPercentage > 75 
                              ? "#f59e0b" 
                              : "#ef4444"
                        }}
                      ></div>
                    </div>
                    <span>{presentPercentage}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {absentCount > 0 ? (
                    <span className="text-red-500 font-medium">{absentCount}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {lateCount > 0 ? (
                    <span className="text-amber-500 font-medium">{lateCount}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {excusedCount > 0 ? (
                    <span className="text-indigo-500 font-medium">{excusedCount}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentReportList;
