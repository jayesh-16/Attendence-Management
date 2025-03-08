
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStats, Class } from "@/types";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { PieChart as RechartsPlot, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AttendanceOverviewReportProps {
  stats: AttendanceStats;
  classes: Class[];
}

const AttendanceOverviewReport = ({ stats, classes }: AttendanceOverviewReportProps) => {
  // Prepare data for pie chart
  const chartData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
    { name: 'Late', value: stats.late, color: '#f59e0b' },
    { name: 'Excused', value: stats.excused, color: '#6366f1' },
  ];

  // Calculate percentages
  const total = stats.total || 1; // Avoid division by zero
  const presentPercentage = Math.round((stats.present / total) * 100);
  const absentPercentage = Math.round((stats.absent / total) * 100);
  const latePercentage = Math.round((stats.late / total) * 100);
  const excusedPercentage = Math.round((stats.excused / total) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="text-base font-medium">Attendance Overview</CardTitle>
          <PieChart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPlot>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPlot>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardTitle className="text-base font-medium">Attendance Summary</CardTitle>
          <CardDescription>Overall attendance statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-present"></div>
                <span className="text-sm font-medium">Present</span>
              </div>
              <span className="text-sm font-medium">{presentPercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${presentPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-absent"></div>
                <span className="text-sm font-medium">Absent</span>
              </div>
              <span className="text-sm font-medium">{absentPercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all"
                style={{ width: `${absentPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-late"></div>
                <span className="text-sm font-medium">Late</span>
              </div>
              <span className="text-sm font-medium">{latePercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${latePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-excused"></div>
                <span className="text-sm font-medium">Excused</span>
              </div>
              <span className="text-sm font-medium">{excusedPercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${excusedPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="text-base font-medium">Class Information</CardTitle>
          <CardDescription>Total number of classes: {classes.length}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="flex justify-between items-center p-2 hover:bg-muted/10 rounded-md transition-colors">
                <div className="text-sm font-medium">{classItem.name}</div>
                <div className="text-sm text-muted-foreground">{classItem.students.length} students</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceOverviewReport;
