
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@/types";
import { calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";
import { BarChartIcon } from "lucide-react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

interface ClassAttendanceReportProps {
  classes: Class[];
  selectedClass: string;
  setSelectedClass: (classId: string) => void;
}

const ClassAttendanceReport = ({ 
  classes, 
  selectedClass, 
  setSelectedClass 
}: ClassAttendanceReportProps) => {
  
  const classData = classes.find(c => c.id === selectedClass) || classes[0];
  const attendanceRecords = generateAttendanceRecords(classData.id, classData.students);
  const stats = calculateAttendanceStats(attendanceRecords);
  
  // Calculate percentages for selected class
  const total = stats.total || 1; // Avoid division by zero
  const presentPercentage = Math.round((stats.present / total) * 100);
  const absentPercentage = Math.round((stats.absent / total) * 100);
  const latePercentage = Math.round((stats.late / total) * 100);
  const excusedPercentage = Math.round((stats.excused / total) * 100);
  
  // Prepare data for bar chart
  const barChartData = [
    { name: "Present", value: presentPercentage, fill: "#10b981" },
    { name: "Absent", value: absentPercentage, fill: "#ef4444" },
    { name: "Late", value: latePercentage, fill: "#f59e0b" },
    { name: "Excused", value: excusedPercentage, fill: "#6366f1" },
  ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Class Attendance Report</CardTitle>
              <CardDescription>View detailed attendance statistics by class</CardDescription>
            </div>
            <div className="w-full md:w-[200px]">
              <Select 
                value={selectedClass} 
                onValueChange={setSelectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="overflow-hidden shadow-sm">
                <CardHeader className="p-4 pb-2 bg-gradient-to-r from-green-500/10 to-green-500/5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-green-500">{presentPercentage}%</div>
                  <p className="text-xs text-muted-foreground">{stats.present} students</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-sm">
                <CardHeader className="p-4 pb-2 bg-gradient-to-r from-red-500/10 to-red-500/5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-red-500">{absentPercentage}%</div>
                  <p className="text-xs text-muted-foreground">{stats.absent} students</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-sm">
                <CardHeader className="p-4 pb-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Late</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-amber-500">{latePercentage}%</div>
                  <p className="text-xs text-muted-foreground">{stats.late} students</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-sm">
                <CardHeader className="p-4 pb-2 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Excused</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-indigo-500">{excusedPercentage}%</div>
                  <p className="text-xs text-muted-foreground">{stats.excused} students</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-base font-medium">Attendance Distribution</CardTitle>
                <BarChartIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-sm text-muted-foreground">
              <strong>Class Details:</strong> {classData.grade} | {classData.schedule}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Total Students:</strong> {classData.students.length} | <strong>Description:</strong> {classData.description}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassAttendanceReport;
