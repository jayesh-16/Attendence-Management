
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface StatisticsViewProps {
  gradeFilter: string;
}

const StatisticsView = ({ gradeFilter }: StatisticsViewProps) => {
  // Fetch students data filtered by grade
  const { data: studentsData = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students', gradeFilter],
    queryFn: async () => {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('grade', gradeFilter);
      
      if (classesError) throw classesError;
      
      if (!classesData || classesData.length === 0) {
        return [];
      }
      
      const classIds = classesData.map(c => c.id);
      
      const { data, error } = await supabase
        .from('class_students')
        .select('student:students(*)')
        .in('class_id', classIds);
      
      if (error) throw error;
      
      // Extract unique students (a student might be in multiple classes)
      const uniqueStudents = [];
      const studentIds = new Set();
      
      data.forEach(item => {
        if (!studentIds.has(item.student.id)) {
          studentIds.add(item.student.id);
          uniqueStudents.push(item.student);
        }
      });
      
      return uniqueStudents;
    },
  });

  // Fetch teachers data
  const { data: teachersData = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch attendance data for the grade
  const { data: attendanceData = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance', gradeFilter],
    queryFn: async () => {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('grade', gradeFilter);
      
      if (classesError) throw classesError;
      
      if (!classesData || classesData.length === 0) {
        return [];
      }
      
      const classIds = classesData.map(c => c.id);
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .in('class_id', classIds);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Prepare daily attendance data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const attendanceByDayData = days.map(day => {
    // In a real app, we would calculate these values from actual attendance records
    return {
      name: day,
      present: Math.floor(Math.random() * 50) + 30,
      absent: Math.floor(Math.random() * 20)
    };
  });

  // Attendance status counts
  const presentCount = attendanceData.filter(record => record.status === 'present').length;
  const absentCount = attendanceData.filter(record => record.status === 'absent').length;
  const lateCount = attendanceData.filter(record => record.status === 'late').length;
  const excusedCount = attendanceData.filter(record => record.status === 'excused').length;
  
  // Calculate statistics numbers
  const totalStudents = studentsData.length;
  const totalTeachers = teachersData.length;

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
        <CardTitle>{gradeFilter} Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard 
            title="Students" 
            value={totalStudents} 
            icon={<Users className="h-5 w-5 text-blue-500" />} 
            color="bg-blue-100" 
            isLoading={isLoadingStudents}
          />
          <StatCard 
            title="Teachers" 
            value={totalTeachers} 
            icon={<GraduationCap className="h-5 w-5 text-yellow-500" />} 
            color="bg-yellow-100" 
            isLoading={isLoadingTeachers}
          />
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Present" fill="#69c0ff" />
                  <Bar dataKey="absent" name="Absent" fill="#ffc069" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, isLoading }) => (
  <Card className="overflow-hidden">
    <div className="p-4 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {isLoading ? (
          <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        )}
      </div>
      <div className={`${color} p-2 rounded-full`}>
        {icon}
      </div>
    </div>
  </Card>
);

export default StatisticsView;
