
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface StatisticsViewProps {
  selectedClassId: string;
}

const COLORS = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b'];

const StatisticsView: React.FC<StatisticsViewProps> = ({ selectedClassId }) => {
  const [selectedGrade, setSelectedGrade] = useState("SE MME");
  const [timeRange, setTimeRange] = useState("7"); // 7 days default
  const [selectedSubject, setSelectedSubject] = useState<string | null>(selectedClassId || null);

  // Fetch all classes for the selected grade
  const { data: classes = [] } = useQuery({
    queryKey: ['classes', selectedGrade],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('grade', selectedGrade);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch attendance statistics for the selected grade and time range
  const { data: classStats = [] } = useQuery({
    queryKey: ['classStats', selectedGrade, timeRange, selectedSubject],
    queryFn: async () => {
      const query = supabase
        .from('attendance_records')
        .select(`
          id,
          status,
          date,
          class_id,
          classes!inner(
            id,
            name,
            grade
          )
        `)
        .eq('classes.grade', selectedGrade)
        .gte('date', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());
      
      // Add subject filter if a subject is selected
      if (selectedSubject) {
        query.eq('class_id', selectedSubject);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Prepare chart data for overall attendance
  const overallChartData = [
    { name: 'Present', value: classStats.filter(r => r.status === 'present').length },
    { name: 'Absent', value: classStats.filter(r => r.status === 'absent').length },
    { name: 'Late', value: classStats.filter(r => r.status === 'late').length },
    { name: 'Excused', value: classStats.filter(r => r.status === 'excused').length },
  ];

  // Prepare data for subjects breakdown
  const subjectChartData = classes.map(cls => {
    const subjectStats = classStats.filter(stat => stat.class_id === cls.id);
    const total = subjectStats.length;
    const present = subjectStats.filter(r => r.status === 'present').length;
    const absent = subjectStats.filter(r => r.status === 'absent').length;
    const late = subjectStats.filter(r => r.status === 'late').length;
    const excused = subjectStats.filter(r => r.status === 'excused').length;
    
    return {
      name: cls.name,
      present,
      absent,
      late, 
      excused,
      total,
      attendanceRate: total > 0 ? (present / total) * 100 : 0
    };
  });

  // Group attendance data by date for trends
  const trendData = classStats.reduce((acc: any[], record) => {
    const date = new Date(record.date).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      if (record.status === 'present') existing.present++;
      if (record.status === 'absent') existing.absent++;
      if (record.status === 'late') existing.late++;
      if (record.status === 'excused') existing.excused++;
      existing.total++;
    } else {
      acc.push({
        date,
        present: record.status === 'present' ? 1 : 0,
        absent: record.status === 'absent' ? 1 : 0,
        late: record.status === 'late' ? 1 : 0,
        excused: record.status === 'excused' ? 1 : 0,
        total: 1
      });
    }
    
    return acc;
  }, []);

  // Sort by date ascending
  trendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Attendance Statistics {selectedClassId && `for Class ${selectedClassId}`}</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SE MME">SE MME</SelectItem>
                <SelectItem value="TE MME">TE MME</SelectItem>
                <SelectItem value="BE MME">BE MME</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">By Subject</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overall Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overallChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overallChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {overallChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <CardTitle>Subject-specific Statistics</CardTitle>
                <Select 
                  value={selectedSubject || ""} 
                  onValueChange={(value) => setSelectedSubject(value || null)}
                >
                  <SelectTrigger className="w-[200px] mt-2 sm:mt-0">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All subjects</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" stackId="a" fill="#10b981" />
                      <Bar dataKey="absent" stackId="a" fill="#ef4444" />
                      <Bar dataKey="late" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="excused" stackId="a" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Subject</th>
                        <th className="px-4 py-2">Present</th>
                        <th className="px-4 py-2">Absent</th>
                        <th className="px-4 py-2">Late</th>
                        <th className="px-4 py-2">Excused</th>
                        <th className="px-4 py-2">Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectChartData.map((subject, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 font-medium">{subject.name}</td>
                          <td className="px-4 py-2">{subject.present}</td>
                          <td className="px-4 py-2">{subject.absent}</td>
                          <td className="px-4 py-2">{subject.late}</td>
                          <td className="px-4 py-2">{subject.excused}</td>
                          <td className="px-4 py-2">{subject.attendanceRate.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#10b981" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="absent" stroke="#ef4444" />
                      <Line type="monotone" dataKey="late" stroke="#f59e0b" />
                      <Line type="monotone" dataKey="excused" stroke="#6366f1" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsView;
