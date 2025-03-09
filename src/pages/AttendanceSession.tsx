
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  mockClasses, 
  getStudentsWithAttendance 
} from "@/lib/mock-data";
import { AttendanceStatus } from "@/types";

// Import refactored components
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceActions from "@/components/attendance/AttendanceActions";
import SearchBar from "@/components/attendance/SearchBar";
import ClassDetailsCard from "@/components/attendance/ClassDetailsCard";
import StudentsAttendanceList from "@/components/attendance/StudentsAttendanceList";
import NoteDialog from "@/components/attendance/NoteDialog";

const AttendanceSession = () => {
  const { classId, date } = useParams<{ classId: string; date: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  
  // Find the class
  const currentClass = mockClasses.find(c => c.id === classId);
  
  // Get attendance data
  const [attendanceData, setAttendanceData] = useState<{
    student: {
      id: string;
      name: string;
      avatarUrl?: string;
      studentId: string;
      email: string;
    };
    status: AttendanceStatus;
    note?: string;
  }[]>([]);
  
  useEffect(() => {
    if (classId && date) {
      const data = getStudentsWithAttendance(classId, date);
      setAttendanceData(data);
    }
  }, [classId, date]);
  
  if (!currentClass) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Class not found</p>
      </div>
    );
  }
  
  // Filter students based on search query
  const filteredStudents = attendanceData.filter(item => 
    item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count statistics
  const stats = {
    present: attendanceData.filter(item => item.status === "present").length,
    absent: attendanceData.filter(item => item.status === "absent").length,
    late: attendanceData.filter(item => item.status === "late").length,
    excused: attendanceData.filter(item => item.status === "excused").length,
    total: attendanceData.length,
  };
  
  // Update attendance status
  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.student.id === studentId 
          ? { ...item, status } 
          : item
      )
    );
    
    // Show feedback
    toast({
      title: "Status updated",
      description: `Student marked as ${status}`,
      duration: 1500,
    });
  };
  
  // Add or update note
  const openNoteDialog = (studentId: string) => {
    const student = attendanceData.find(item => item.student.id === studentId);
    setSelectedStudent(studentId);
    setCurrentNote(student?.note || "");
    setNoteDialogOpen(true);
  };
  
  const saveNote = () => {
    if (!selectedStudent) return;
    
    setAttendanceData(prev => 
      prev.map(item => 
        item.student.id === selectedStudent 
          ? { ...item, note: currentNote } 
          : item
      )
    );
    
    setNoteDialogOpen(false);
    setSelectedStudent(null);
    
    // Show feedback
    toast({
      title: "Note saved",
      description: "Attendance note has been updated",
      duration: 1500,
    });
  };
  
  // Save all attendance
  const saveAllAttendance = () => {
    // In a real app, this would save to database
    toast({
      title: "Attendance saved",
      description: "All attendance records have been saved successfully",
    });
    
    setTimeout(() => {
      navigate("/attendance");
    }, 1500);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AttendanceHeader currentClass={currentClass} date={date || ""} />
        
        <AttendanceActions saveAllAttendance={saveAllAttendance} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle>Student Attendance</CardTitle>
                <Badge className="ml-2">{currentClass.students.length} Students</Badge>
              </div>
              <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StudentsAttendanceList 
                filteredStudents={filteredStudents}
                stats={stats}
                updateStatus={updateStatus}
                openNoteDialog={openNoteDialog}
              />
            </div>
          </CardContent>
        </Card>
        
        <ClassDetailsCard 
          currentClass={currentClass}
          stats={stats}
        />
      </div>
      
      <NoteDialog 
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        saveNote={saveNote}
      />
    </div>
  );
};

export default AttendanceSession;
