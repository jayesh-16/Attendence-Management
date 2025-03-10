
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const StatisticsView = () => {
  const [selectedGrade, setSelectedGrade] = useState("SE MME");
  const [timeRange, setTimeRange] = useState("7"); // 7 days default

  const { data: classStats } = useQuery({
    queryKey: ['classStats', selectedGrade, timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          status,
          classes!inner(
            name,
            grade
          )
        `)
        .eq('classes.grade', selectedGrade)
        .gte('date', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data;
    },
  });

  // Prepare chart data
  const chartData = classStats ? [
    { name: 'Present', value: classStats.filter(r => r.status === 'present').length },
    { name: 'Absent', value: classStats.filter(r => r.status === 'absent').length },
    { name: 'Late', value: classStats.filter(r => r.status === 'late').length },
    { name: 'Excused', value: classStats.filter(r => r.status === 'excused').length },
  ] : [];

  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Attendance Statistics</CardTitle>
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
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            {/* Subject-specific stats will be shown here */}
          </TabsContent>

          <TabsContent value="trends">
            {/* Trend analysis will be shown here */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsView;
