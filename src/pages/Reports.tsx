
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses, calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";
import AttendanceOverviewReport from "@/components/reports/AttendanceOverviewReport";
import ClassAttendanceReport from "@/components/reports/ClassAttendanceReport";
import StudentReportList from "@/components/reports/StudentReportList";
import TrendReport from "@/components/reports/TrendReport";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id);

  // Get class data and records
  const classData = mockClasses.find(c => c.id === selectedClass) || mockClasses[0];
  const attendanceRecords = generateAttendanceRecords(classData.id, classData.students);
  const stats = calculateAttendanceStats(attendanceRecords);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Reports</h1>
        <p className="text-muted-foreground mt-1">View attendance analytics and generate reports</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px] bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="classes" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Classes</TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Students</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-fade-in">
          <AttendanceOverviewReport stats={stats} classes={mockClasses} />
        </TabsContent>

        <TabsContent value="classes" className="animate-fade-in">
          <ClassAttendanceReport 
            classes={mockClasses} 
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        </TabsContent>

        <TabsContent value="students" className="animate-fade-in">
          <StudentReportList classData={classData} attendanceRecords={attendanceRecords} />
        </TabsContent>

        <TabsContent value="trends" className="animate-fade-in">
          <TrendReport classes={mockClasses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
