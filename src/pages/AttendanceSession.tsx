
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
import { AttendanceStatus, Student } from "@/types";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import refactored components
import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceActions from "@/components/attendance/AttendanceActions";
import SearchBar from "@/components/attendance/SearchBar";
import ClassDetailsCard from "@/components/attendance/ClassDetailsCard";
import StudentsAttendanceList from "@/components/attendance/StudentsAttendanceList";
import NoteDialog from "@/components/attendance/NoteDialog";

// Define the correct type for attendanceData state
interface AttendanceItem {
  student: Student;
  status: AttendanceStatus;
  note?: string;
}

const AttendanceSession = () => {
  const { classId, date } = useParams<{ classId: string; date: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  
  // Fetch class data
  const { data: currentClass, isLoading: classLoading, error: classError } = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!classId) throw new Error("No class ID provided");
      
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:class_students(
            student:students(*)
          )
        `)
        .eq('id', classId)
        .single();
      
      if (error) {
        toast.error('Failed to load class: ' + error.message);
        throw error;
      }
      
      // Transform the data to match expected format
      return {
        ...data,
        id: data.id,
        name: data.name,
        description: data.description,
        schedule: data.schedule,
        grade: data.grade,
        students: data.students?.map(s => ({
          id: s.student.id,
          name: s.student.name,
          studentId: s.student.student_id,
          email: s.student.email || '',
          avatarUrl: s.student.avatar_url
        })) || []
      };
    },
    enabled: !!classId,
  });
  
  // Fetch existing attendance records for this class and date
  const { data: existingAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: async () => {
      if (!classId || !date) throw new Error("Missing classId or date");
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          id,
          student_id,
          status,
          note,
          date
        `)
        .eq('class_id', classId)
        .eq('date', date);
      
      if (error) {
        toast.error('Failed to load attendance records: ' + error.message);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!classId && !!date,
  });
  
  // Initialize or update attendance data when class data is loaded
  useEffect(() => {
    if (!currentClass || attendanceLoading) return;
    
    // Map students to attendance records
    const attendanceRecords: AttendanceItem[] = currentClass.students.map(student => {
      // Find if there's an existing record for this student
      const existingRecord = existingAttendance?.find(
        record => record.student_id === student.id
      );
      
      return {
        student,
        status: existingRecord?.status as AttendanceStatus || "present", // Default to present
        note: existingRecord?.note || ""
      };
    });
    
    setAttendanceData(attendanceRecords);
  }, [currentClass, existingAttendance, attendanceLoading]);
  
  // If loading, show loading state
  if (classLoading || attendanceLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading attendance data...</p>
        </div>
      </div>
    );
  }
  
  // If error or no class found, show error state
  if (classError || !currentClass) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Failed to load class data. Please try again.</p>
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
    uiToast({
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
    uiToast({
      title: "Note saved",
      description: "Attendance note has been updated",
      duration: 1500,
    });
  };
  
  // Save all attendance
  const saveAllAttendance = async () => {
    if (!classId || !date) return;
    
    try {
      // Create array of attendance records to upsert
      const records = attendanceData.map(item => ({
        class_id: classId,
        student_id: item.student.id,
        status: item.status,
        note: item.note || null,
        date: date,
        created_by: "system", // This should be the user ID in a real app
      }));
      
      // Delete existing records first (if any)
      await supabase
        .from('attendance_records')
        .delete()
        .eq('class_id', classId)
        .eq('date', date);
      
      // Insert new records
      const { error } = await supabase
        .from('attendance_records')
        .insert(records);
      
      if (error) throw error;
      
      // Show success message
      toast.success("Attendance records saved successfully");
      
      // Navigate back to attendance page
      setTimeout(() => {
        navigate("/attendance");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance records");
    }
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
