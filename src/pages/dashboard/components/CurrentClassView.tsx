
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import StudentsList from './StudentsList';
import { toast } from "sonner";

interface CurrentClassViewProps {
  selectedClassId: string;
}

const CurrentClassView: React.FC<CurrentClassViewProps> = ({ selectedClassId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch class data 
  const { data: classData, isLoading: isLoadingClass } = useQuery({
    queryKey: ['class', selectedClassId],
    enabled: !!selectedClassId,
    queryFn: async () => {
      if (!selectedClassId) return null;
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', selectedClassId)
        .single();
        
      if (error) {
        toast.error('Failed to load class: ' + error.message);
        throw error;
      }
      
      return data;
    }
  });
  
  // Fetch students for the selected class
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['classStudents', selectedClassId],
    enabled: !!selectedClassId,
    queryFn: async () => {
      if (!selectedClassId) return [];
      
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          student:students(*)
        `)
        .eq('class_id', selectedClassId);
      
      if (error) {
        toast.error('Failed to load students: ' + error.message);
        throw error;
      }
      
      return data.map(item => ({
        ...item.student,
        status: 'none' as 'present' | 'absent' | 'none'
      }));
    }
  });
  
  // Fetch attendance stats
  const { data: attendanceStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['classAttendanceStats', selectedClassId],
    enabled: !!selectedClassId,
    queryFn: async () => {
      if (!selectedClassId) return { total: 0, present: 0, absent: 0 };
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('class_id', selectedClassId)
        .eq('date', today);
      
      if (error) {
        toast.error('Failed to load attendance stats: ' + error.message);
        throw error;
      }
      
      const present = data.filter(r => r.status === 'present').length;
      const absent = data.filter(r => r.status === 'absent').length;
      
      return {
        total: students.length,
        present,
        absent
      };
    }
  });
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    searchQuery ? student.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMarkPresent = async (studentId: string) => {
    if (!selectedClassId) return;
    
    try {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You need to be logged in to record attendance');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance_records')
        .upsert({
          class_id: selectedClassId,
          student_id: studentId,
          status: 'present',
          date: today,
          created_by: user.id
        });
      
      if (error) {
        toast.error('Failed to mark as present: ' + error.message);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  const handleMarkAbsent = async (studentId: string) => {
    if (!selectedClassId) return;
    
    try {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You need to be logged in to record attendance');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance_records')
        .upsert({
          class_id: selectedClassId,
          student_id: studentId,
          status: 'absent',
          date: today,
          created_by: user.id
        });
      
      if (error) {
        toast.error('Failed to mark as absent: ' + error.message);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  if (!selectedClassId) {
    return (
      <Card className="animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
          <CardTitle>No Class Selected</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Please select a class to view its details and students.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
        <CardTitle>
          {isLoadingClass ? 'Loading...' : `Current Class: ${classData?.name || 'Unknown'}`}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Mark students as present or absent. Changes are saved automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background">
              Total: {attendanceStats?.total || 0}
            </Badge>
            <Badge className="bg-green-500 hover:bg-green-600">
              Present: {attendanceStats?.present || 0}
            </Badge>
            <Badge className="bg-red-500 hover:bg-red-600">
              Absent: {attendanceStats?.absent || 0}
            </Badge>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        {isLoadingStudents ? (
          <div className="text-center py-8">Loading students...</div>
        ) : filteredStudents.length > 0 ? (
          <StudentsList 
            students={filteredStudents}
            onMarkPresent={handleMarkPresent}
            onMarkAbsent={handleMarkAbsent}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No students found matching your search.' : 'No students in this class.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentClassView;
