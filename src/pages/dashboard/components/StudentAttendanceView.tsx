
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, PencilLine, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student } from "@/types";

interface StudentAttendanceViewProps {
  gradeFilter: string;
}

const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ gradeFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    studentId: ''
  });

  const queryClient = useQueryClient();
  
  // Fetch classes for the grade
  const { data: classesData = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ['grade-classes', gradeFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('grade', gradeFilter);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch students for the grade
  const { data: studentsData = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['grade-students', gradeFilter, selectedSubject],
    queryFn: async () => {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('grade', gradeFilter);
        
      if (classesError) throw classesError;
      
      if (!classesData || classesData.length === 0) {
        return [];
      }
      
      const classIds = selectedSubject 
        ? [selectedSubject] 
        : classesData.map(c => c.id);
      
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          class_id,
          student:students(*)
        `)
        .in('class_id', classIds);
      
      if (error) throw error;
      
      // Extract unique students with their class IDs
      const uniqueStudents = [];
      const studentMap = new Map();
      
      data.forEach(item => {
        const studentId = item.student.id;
        
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: studentId,
            name: item.student.name,
            email: item.student.email || '',
            studentId: item.student.student_id,
            avatarUrl: item.student.avatar_url,
            classIds: [item.class_id]
          });
        } else {
          // Add another class ID to existing student
          const student = studentMap.get(studentId);
          if (!student.classIds.includes(item.class_id)) {
            student.classIds.push(item.class_id);
          }
        }
      });
      
      // Convert map to array and return
      studentMap.forEach(student => {
        uniqueStudents.push(student);
      });
      
      return uniqueStudents;
    },
    enabled: isLoadingClasses === false
  });
  
  // Fetch attendance data for today
  const { data: attendanceData = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance-today', gradeFilter, selectedSubject],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('grade', gradeFilter);
        
      if (classesError) throw classesError;
      
      if (!classesData || classesData.length === 0) {
        return [];
      }
      
      const classIds = selectedSubject 
        ? [selectedSubject] 
        : classesData.map(c => c.id);
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .in('class_id', classIds)
        .eq('date', today);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (studentData: { name: string, email: string, studentId: string }) => {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // First, add the student to the students table
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          name: studentData.name,
          email: studentData.email,
          student_id: studentData.studentId,
          created_by: user.id
        })
        .select()
        .single();
      
      if (studentError) throw studentError;
      
      // Then, add the student to the selected class
      if (selectedSubject) {
        const { error: classStudentError } = await supabase
          .from('class_students')
          .insert({
            class_id: selectedSubject,
            student_id: newStudent.id
          });
        
        if (classStudentError) throw classStudentError;
      }
      
      return newStudent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-students'] });
      setIsAddStudentOpen(false);
      setNewStudent({ name: '', email: '', studentId: '' });
      toast.success('Student added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add student: ' + error.message);
    }
  });
  
  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (studentData: Student) => {
      const { error } = await supabase
        .from('students')
        .update({
          name: studentData.name,
          email: studentData.email,
          student_id: studentData.studentId
        })
        .eq('id', studentData.id);
      
      if (error) throw error;
      
      return studentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-students'] });
      setIsEditStudentOpen(false);
      setSelectedStudent(null);
      toast.success('Student details updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update student: ' + error.message);
    }
  });
  
  // Record attendance mutation
  const recordAttendanceMutation = useMutation({
    mutationFn: async ({ studentId, status }: { studentId: string, status: 'present' | 'absent' | 'late' }) => {
      const today = new Date().toISOString().split('T')[0];
      const classId = selectedSubject || classesData[0]?.id;
      
      if (!classId) {
        throw new Error('No class selected');
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('attendance_records')
        .upsert({
          class_id: classId,
          student_id: studentId,
          date: today,
          status,
          created_by: user.id
        });
      
      if (error) throw error;
      
      return { studentId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error) => {
      toast.error('Failed to record attendance: ' + error.message);
    }
  });
  
  // Filter students based on search
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get student attendance status
  const getStudentAttendanceStatus = (studentId: string) => {
    const record = attendanceData.find(
      record => record.student_id === studentId && 
      (selectedSubject ? record.class_id === selectedSubject : true)
    );
    
    return record ? record.status : null;
  };
  
  // Handle adding a new student
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.studentId) {
      toast.error('Name and Student ID are required');
      return;
    }
    
    addStudentMutation.mutate(newStudent);
  };
  
  // Handle updating a student
  const handleUpdateStudent = () => {
    if (!selectedStudent || !selectedStudent.name || !selectedStudent.studentId) {
      toast.error('Name and Student ID are required');
      return;
    }
    
    updateStudentMutation.mutate(selectedStudent);
  };
  
  // Open edit student dialog
  const openEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditStudentOpen(true);
  };
  
  // Mark attendance
  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    recordAttendanceMutation.mutate({ studentId, status });
  };
  
  const getAttendanceIcon = (status: string | null) => {
    if (status === 'present') 
      return <Check className="h-5 w-5 text-green-500" />;
    if (status === 'absent') 
      return <X className="h-5 w-5 text-red-500" />;
    if (status === 'late') 
      return <Clock className="h-5 w-5 text-yellow-500" />;
    return null;
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
        <CardTitle>{gradeFilter} Student Attendance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <Tabs 
              defaultValue="all" 
              value={selectedSubject || "all"} 
              onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}
              className="w-full"
            >
              <TabsList className="w-full h-auto flex-wrap">
                <TabsTrigger value="all">All Subjects</TabsTrigger>
                {classesData.map(cls => (
                  <TabsTrigger key={cls.id} value={cls.id}>{cls.name}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/30 font-medium">
            <div className="col-span-5 md:col-span-4">Student</div>
            <div className="col-span-3 md:col-span-3">ID</div>
            <div className="col-span-2 md:col-span-3">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {isLoadingStudents ? (
            <div className="p-6 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No students found</p>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => {
                  if (!selectedSubject && classesData.length > 0) {
                    toast.error("Please select a subject first");
                    return;
                  }
                  setIsAddStudentOpen(true);
                }}
              >
                <Plus size={16} />
                Add Student
              </Button>
            </div>
          ) : (
            <>
              {filteredStudents.map((student) => {
                const attendanceStatus = getStudentAttendanceStatus(student.id);
                
                return (
                  <div key={student.id} className="grid grid-cols-12 gap-4 p-3 border-b items-center hover:bg-muted/10">
                    <div className="col-span-5 md:col-span-4 flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-primary/10">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback className="bg-primary/10">{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium line-clamp-1">{student.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-3 md:col-span-3">
                      <p className="text-sm">{student.studentId}</p>
                    </div>
                    
                    <div className="col-span-2 md:col-span-3 flex gap-2">
                      {getAttendanceIcon(attendanceStatus)}
                      <span className="capitalize text-sm">
                        {attendanceStatus || 'Not marked'}
                      </span>
                    </div>
                    
                    <div className="col-span-2 flex justify-end gap-1">
                      {!attendanceStatus && (
                        <>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-green-500 hover:bg-green-100 hover:text-green-700"
                            onClick={() => markAttendance(student.id, 'present')}
                          >
                            <Check size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
                            onClick={() => markAttendance(student.id, 'absent')}
                          >
                            <X size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-700"
                            onClick={() => markAttendance(student.id, 'late')}
                          >
                            <Clock size={16} />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                        onClick={() => openEditStudent(student)}
                      >
                        <PencilLine size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              <div className="p-3 flex justify-end">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={() => {
                    if (!selectedSubject && classesData.length > 0) {
                      toast.error("Please select a subject first");
                      return;
                    }
                    setIsAddStudentOpen(true);
                  }}
                >
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Add a new student to the {selectedSubject 
                ? classesData.find(c => c.id === selectedSubject)?.name 
                : gradeFilter}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input 
                id="name" 
                value={newStudent.name} 
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} 
                placeholder="Enter student name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={newStudent.email} 
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} 
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input 
                id="studentId" 
                value={newStudent.studentId} 
                onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})} 
                placeholder="Enter student ID"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStudent} 
              disabled={!newStudent.name || !newStudent.studentId}
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Student Name</Label>
                <Input 
                  id="edit-name" 
                  value={selectedStudent.name} 
                  onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})} 
                  placeholder="Enter student name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={selectedStudent.email} 
                  onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})} 
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-studentId">Student ID</Label>
                <Input 
                  id="edit-studentId" 
                  value={selectedStudent.studentId} 
                  onChange={(e) => setSelectedStudent({...selectedStudent, studentId: e.target.value})} 
                  placeholder="Enter student ID"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStudent} 
              disabled={!selectedStudent || !selectedStudent.name || !selectedStudent.studentId}
            >
              Update Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StudentAttendanceView;
