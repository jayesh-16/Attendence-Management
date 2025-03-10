
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, UserPlus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StudentDialog from './StudentDialog';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatarUrl?: string;
  status: "present" | "absent" | "none";
}

interface StudentsListProps {
  classId?: string;
  grade?: string;
  students?: Student[];
  onMarkPresent?: (studentId: string) => void;
  onMarkAbsent?: (studentId: string) => void;
  onStudentAdded?: () => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  classId,
  grade = '',
  students: propStudents,
  onMarkPresent,
  onMarkAbsent,
  onStudentAdded
}) => {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [students, setStudents] = useState<Student[]>(propStudents || []);
  const [loading, setLoading] = useState(!propStudents);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (propStudents) {
      setStudents(propStudents);
      return;
    }
    
    if (classId) {
      fetchStudentsForClass();
    }
  }, [classId, propStudents]);

  const fetchStudentsForClass = async () => {
    if (!classId || !user) return;
    
    try {
      setLoading(true);
      
      // Get students associated with this class
      const { data: classStudents, error: classError } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);
        
      if (classError) throw classError;
      
      if (classStudents && classStudents.length > 0) {
        const studentIds = classStudents.map(cs => cs.student_id);
        
        // Get student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id, name, email, student_id, avatar_url')
          .in('id', studentIds);
          
        if (studentError) throw studentError;
        
        if (studentData) {
          setStudents(studentData.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email || '',
            studentId: student.student_id,
            avatarUrl: student.avatar_url,
            status: 'none' as "present" | "absent" | "none"
          })));
        }
      } else {
        setStudents([]);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = () => {
    fetchStudentsForClass();
    onStudentAdded?.();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check size={14} className="mr-1" /> Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-500 hover:bg-red-600"><X size={14} className="mr-1" /> Absent</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 font-medium">
          <div className="col-span-6 sm:col-span-7">Student</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-3 sm:col-span-2 text-center">Actions</div>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No students found</p>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => setIsAddingStudent(true)}
            >
              <UserPlus size={16} />
              Add Student
            </Button>
          </div>
        ) : (
          <>
            {students.map((student) => (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-3 border-b items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-6 sm:col-span-7 flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-primary/20">
                    <AvatarImage src={student.avatarUrl} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20">{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <div className="font-medium truncate">{student.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {student.studentId}{student.email ? ` • ${student.email}` : ''}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3 flex justify-center">
                  {getStatusBadge(student.status)}
                </div>
                
                <div className="col-span-3 sm:col-span-2 flex justify-center gap-1">
                  {onMarkPresent && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                      onClick={() => onMarkPresent(student.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {onMarkAbsent && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                      onClick={() => onMarkAbsent(student.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="p-3 flex justify-end">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => setIsAddingStudent(true)}
              >
                <UserPlus size={16} />
                Add Student
              </Button>
            </div>
          </>
        )}
      </div>

      <StudentDialog 
        open={isAddingStudent} 
        onOpenChange={setIsAddingStudent}
        classId={classId}
        grade={grade}
        onSuccess={handleStudentAdded}
      />
    </>
  );
};

export default StudentsList;
