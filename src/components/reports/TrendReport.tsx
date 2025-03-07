
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@/types";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface TrendReportProps {
  classes: Class[];
}

const TrendReport = ({ classes }: TrendReportProps) => {
  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const [timeRange, setTimeRange] = useState("7");
  
  const classData = classes.find(c => c.id === selectedClass) || classes[0];
  const days = parseInt(timeRange);
  
  // Generate dates for the selected range
  const dates = eachDayOfInterval({
    start: subDays(new Date(), days - 1),
    end: new Date()
  }).map(date => format(date, "yyyy-MM-dd"));
  
  // Get all attendance records
  const allRecords = generateAttendanceRecords(classData.id, classData.students);
  
  // Prepare data for the line chart
  const chartData = dates.map(date => {
    const dayRecords = allRecords.filter(record => record.date === date);
    const stats = calculateAttendanceStats(dayRecords);
    const total = stats.total || 1;
    
    return {
      date: format(new Date(date), "MMM dd"),
      present: Math.round((stats.present / total) * 100),
      absent: Math.round((stats.absent / total) * 100),
      late: Math.round((stats.late / total) * 100),
      excused: Math.round((stats.excused / total) * 100),
    };
  });
  
  // Calculate trend
  const firstPresent = chartData[0]?.present || 0;
  const lastPresent = chartData[chartData.length - 1]?.present || 0;
  const trend = lastPresent - firstPresent;
  
  // Find min and max attendance
  const attendanceValues = chartData.map(item => item.present);
  const maxAttendance = Math.max(...attendanceValues);
  const minAttendance = Math.min(...attendanceValues);
  const maxDay = chartData.find(item => item.present === maxAttendance)?.date || "";
  const minDay = chartData.find(item => item.present === minAttendance)?.date || "";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Track attendance patterns over time</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-[150px]">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              <div className="w-full sm:w-[150px]">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-sm font-medium">Attendance Trend</CardTitle>
                <TrendingUp className={`h-4 w-4 ${trend >= 0 ? "text-green-500" : "text-red-500"}`} />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className={`text-2xl font-bold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {trend >= 0 ? "+" : ""}{trend}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {trend >= 0 ? "Increase" : "Decrease"} over the period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-medium">Highest Attendance</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-500">{maxAttendance}%</div>
                <p className="text-xs text-muted-foreground">on {maxDay}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-medium">Lowest Attendance</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-500">{minAttendance}%</div>
                <p className="text-xs text-muted-foreground">on {minDay}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Attendance Trends</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
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
          
          <div className="text-sm text-muted-foreground">
            <strong>Note:</strong> This report shows attendance trends for {classData.name} over the past {days} days.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendReport;
