
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, UserCheck, Mail, Check, X, Clock, Edit, Trash2, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);
  const [selectedGrade, setSelectedGrade] = useState("SE MME");
  
  // New state for student form - simplified to only name and student ID
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  
  // Fetch students data
  const { data: studentsData = [], isLoading: isLoadingStudents, refetch: refetchStudents } = useQuery({
    queryKey: ['students', selectedGrade],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*, classes:class_students(class:classes(*))')
        .order('name');
      
      if (error) {
        toast.error('Failed to load students: ' + error.message);
        throw error;
      }
      
      // Filter students by selected grade
      return data.filter(student => {
        // If the student is part of any class with the selected grade
        return student.classes.some(cls => cls.class.grade === selectedGrade);
      });
    },
  });
  
  // Fetch classes for the dropdown
  const { data: classesData = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('grade')
        .order('grade');
      
      if (error) {
        toast.error('Failed to load classes: ' + error.message);
        throw error;
      }
      
      // Get unique grades
      const uniqueGrades = [...new Set(data.map(cls => cls.grade))];
      return uniqueGrades;
    },
  });
  
  // Filter students based on search query
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get attendance status indicator
  const getAttendanceIndicator = (rate: number) => {
    if (rate >= 90) return { color: "bg-green-500", icon: <Check className="h-4 w-4" />, label: "Excellent" };
    if (rate >= 80) return { color: "bg-amber-500", icon: <Clock className="h-4 w-4" />, label: "Good" };
    return { color: "bg-red-500", icon: <X className="h-4 w-4" />, label: "Needs Improvement" };
  };
  
  const resetForm = () => {
    setNewStudentName("");
    setNewStudentId("");
  };
  
  const handleAddStudent = async () => {
    try {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You need to be logged in to add a student');
        return;
      }
      
      // Add the student to the database
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: newStudentName,
          student_id: newStudentId,
          created_by: user.id
        })
        .select();
      
      if (error) {
        toast.error('Failed to add student: ' + error.message);
        return;
      }
      
      // Add the student to all classes of the selected grade
      const { data: classesWithGrade, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('grade', selectedGrade);
      
      if (classesError) {
        toast.error('Failed to get classes: ' + classesError.message);
        return;
      }
      
      // Add student to each class of the selected grade
      for (const cls of classesWithGrade) {
        await supabase
          .from('class_students')
          .insert({
            class_id: cls.id,
            student_id: data[0].id
          });
      }
      
      toast.success('Student added successfully!');
      refetchStudents();
      setIsAddStudentOpen(false);
      resetForm();
      
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };
  
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentToDelete.id);
      
      if (error) {
        toast.error('Failed to delete student: ' + error.message);
        return;
      }
      
      toast.success(`Student ${studentToDelete.name} deleted successfully!`);
      refetchStudents();
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };
  
  const handleViewAttendance = (studentId: string) => {
    navigate(`/reports?studentId=${studentId}&grade=${selectedGrade}`);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student data and attendance records</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {classesData.map((grade) => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="default" 
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => setIsAddStudentOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
          <div>
            <CardTitle>Student Directory - {selectedGrade}</CardTitle>
            <CardDescription>View and manage student information</CardDescription>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {isLoadingStudents ? (
            <div className="py-8 text-center">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="border rounded-md divide-y shadow-sm overflow-hidden bg-white">
              {filteredStudents.map((student) => {
                // Mock attendance rate for demo purposes
                const attendanceRate = Math.floor(Math.random() * 20) + 80;
                const attendance = getAttendanceIndicator(attendanceRate);
                
                return (
                  <div key={student.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                    <div className="sm:col-span-4 flex items-center gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0 border border-primary/20">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          {student.name}
                          <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-primary/10 to-secondary/10">
                            {selectedGrade}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {student.student_id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3 flex items-center sm:justify-center mt-2 sm:mt-0">
                      <Badge className={`${attendance.color} flex items-center gap-1 text-white shadow-sm`}>
                        {attendance.icon}
                        <span>{attendanceRate}% Attendance</span>
                      </Badge>
                    </div>
                    
                    <div className="sm:col-span-5 flex justify-end sm:justify-end gap-2 mt-2 sm:mt-0">
                      <Button 
                        variant="default" 
                        size={isMobile ? "sm" : "default"} 
                        className="gap-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        onClick={() => handleViewAttendance(student.id)}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">View Attendance</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size={isMobile ? "sm" : "default"} className="bg-white">
                            <span className="hidden sm:inline">Actions</span>
                            <span className="sm:hidden">...</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => {
                              setStudentToDelete({id: student.id, name: student.name});
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Student Dialog - Simplified to only name and student ID */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student to {selectedGrade}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input 
                id="name" 
                value={newStudentName} 
                onChange={(e) => setNewStudentName(e.target.value)} 
                placeholder="Enter student name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID/Roll Number</Label>
              <Input 
                id="studentId" 
                value={newStudentId} 
                onChange={(e) => setNewStudentId(e.target.value)} 
                placeholder="Enter student ID or roll number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddStudentOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleAddStudent}
              disabled={!newStudentName || !newStudentId}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Student Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;
