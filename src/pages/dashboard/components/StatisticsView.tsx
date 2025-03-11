
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, UserCheck, Users2 } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

// Colors for charts
const GENDER_COLORS = ['#69c0ff', '#ffc0cb'];
const ATTENDANCE_COLORS = ['#69c0ff', '#ffc069', '#ff7875', '#b37feb'];

const StatisticsView = () => {
  const [timeRange, setTimeRange] = useState("7"); // 7 days default

  // Fetch students data
  const { data: studentsData = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch teachers/profiles data
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

  // Fetch attendance data
  const { data: attendanceData = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance', timeRange],
    queryFn: async () => {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(timeRange));
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('date', date.toISOString().split('T')[0]);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Mock gender data - in a real app, we would add a gender field to the students table
  const genderData = [
    { name: 'Boys', value: Math.floor(studentsData.length * 0.45) },
    { name: 'Girls', value: studentsData.length - Math.floor(studentsData.length * 0.45) }
  ];

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
  
  const attendanceStatusData = [
    { name: 'Present', value: presentCount || 75 },
    { name: 'Absent', value: absentCount || 15 },
    { name: 'Late', value: lateCount || 8 },
    { name: 'Excused', value: excusedCount || 5 }
  ];

  // Calculate statistics numbers
  const totalStudents = studentsData.length;
  const totalTeachers = teachersData.length;
  const totalAdmins = 2; // Mock data - in a real app, filter profiles by role
  const totalParents = 382; // Mock data - in a real app, this would be from a parents table

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
        <CardTitle>School Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <StatCard 
            title="Admins" 
            value={totalAdmins} 
            icon={<UserCheck className="h-5 w-5 text-purple-500" />} 
            color="bg-purple-100" 
            isLoading={false}
          />
          <StatCard 
            title="Parents" 
            value={totalParents} 
            icon={<Users2 className="h-5 w-5 text-green-500" />} 
            color="bg-green-100" 
            isLoading={false}
          />
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="gender">Gender Distribution</TabsTrigger>
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

          <TabsContent value="gender" className="h-[300px]">
            <div className="flex items-center justify-center h-full">
              <div className="relative h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex">
                  <Users className="h-12 w-12 text-gray-200" />
                </div>
              </div>
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
