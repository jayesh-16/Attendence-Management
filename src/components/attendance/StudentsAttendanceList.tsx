
import React from 'react';
import { Users, CheckCircle2, XCircle, BadgeAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceStatus, Student } from "@/types";
import StudentAttendanceRow from './StudentAttendanceRow';

interface StudentsAttendanceListProps {
  filteredStudents: {
    student: Student;
    status: AttendanceStatus;
    note?: string;
  }[];
  stats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  updateStatus: (studentId: string, status: AttendanceStatus) => void;
  openNoteDialog: (studentId: string) => void;
}

const StudentsAttendanceList = ({ 
  filteredStudents, 
  stats, 
  updateStatus, 
  openNoteDialog 
}: StudentsAttendanceListProps) => {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Users size={14} />
          <span>All ({stats.total})</span>
        </TabsTrigger>
        <TabsTrigger value="present" className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-present" />
          <span>Present ({stats.present})</span>
        </TabsTrigger>
        <TabsTrigger value="absent" className="flex items-center gap-2">
          <XCircle size={14} className="text-absent" />
          <span>Absent ({stats.absent})</span>
        </TabsTrigger>
        <TabsTrigger value="late" className="flex items-center gap-2">
          <BadgeAlert size={14} className="text-late" />
          <span>Late ({stats.late})</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <div className="border rounded-md divide-y">
          {filteredStudents.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            filteredStudents.map((item) => (
              <StudentAttendanceRow
                key={item.student.id}
                data={item}
                updateStatus={updateStatus}
                openNoteDialog={openNoteDialog}
              />
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="present" className="mt-4">
        <div className="border rounded-md divide-y">
          {filteredStudents.filter(item => item.status === "present").length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No present students</p>
            </div>
          ) : (
            filteredStudents
              .filter(item => item.status === "present")
              .map((item) => (
                <StudentAttendanceRow
                  key={item.student.id}
                  data={item}
                  updateStatus={updateStatus}
                  openNoteDialog={openNoteDialog}
                />
              ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="absent" className="mt-4">
        <div className="border rounded-md divide-y">
          {filteredStudents.filter(item => item.status === "absent").length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No absent students</p>
            </div>
          ) : (
            filteredStudents
              .filter(item => item.status === "absent")
              .map((item) => (
                <StudentAttendanceRow
                  key={item.student.id}
                  data={item}
                  updateStatus={updateStatus}
                  openNoteDialog={openNoteDialog}
                />
              ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="late" className="mt-4">
        <div className="border rounded-md divide-y">
          {filteredStudents.filter(item => item.status === "late").length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No late students</p>
            </div>
          ) : (
            filteredStudents
              .filter(item => item.status === "late")
              .map((item) => (
                <StudentAttendanceRow
                  key={item.student.id}
                  data={item}
                  updateStatus={updateStatus}
                  openNoteDialog={openNoteDialog}
                />
              ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StudentsAttendanceList;
