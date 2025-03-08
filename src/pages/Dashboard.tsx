
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, Users, Check, X, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockClasses, calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0]?.id || "");
  const currentDate = new Date();
  
  // Get class data and records
  const selectedClass = mockClasses.find(cls => cls.id === selectedClassId) || mockClasses[0];
  const attendanceRecords = selectedClass ? generateAttendanceRecords(selectedClass.id, selectedClass.students) : [];
  const stats = calculateAttendanceStats(attendanceRecords);
  
  // Mock students for the selected class with simplified status
  const students = selectedClass ? selectedClass.students.slice(0, 5).map(student => ({
    ...student,
    status: ["present", "absent", "none"][Math.floor(Math.random() * 3)] as "present" | "absent" | "none"
  })) : [];
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check size={14} className="mr-1" /> Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-500 hover:bg-red-600"><X size={14} className="mr-1" /> Absent</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MME-AT-TRACKING</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>Today: {format(currentDate, 'M/d/yyyy')}</span>
          </div>
          
          <Button variant="gradient" onClick={() => navigate('/attendance')} className="whitespace-nowrap">
            Take Attendance
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="current-classes" className="space-y-4">
        <TabsList className="w-full max-w-md bg-muted/50">
          <TabsTrigger value="current-classes" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Current Classes</TabsTrigger>
          <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Statistics</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current-classes" className="space-y-6 mt-6">
          {/* Class cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockClasses.map((cls) => (
              <Card 
                key={cls.id} 
                className={`overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30 hover-scale cursor-pointer ${cls.id === selectedClassId ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleClassSelect(cls.id)}
              >
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
                  <CardTitle className="text-xl">{cls.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{cls.grade}</p>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{cls.schedule}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Students: {cls.students.length}</span>
                    </div>
                    
                    <Button 
                      variant="gradient"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTakeAttendance(cls.id);
                      }}
                      size={isMobile ? "sm" : "default"}
                    >
                      Take Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Current class detail - render dynamically based on selected class */}
          {selectedClass && (
            <Card className="animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
                <CardTitle>Current Class: {selectedClass.name}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Mark students as present or absent. Changes are saved automatically.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background">
                      Total: {stats.total}
                    </Badge>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Present: {stats.present}
                    </Badge>
                    <Badge className="bg-red-500 hover:bg-red-600">
                      Absent: {stats.absent}
                    </Badge>
                  </div>
                  
                  <div className="w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 font-medium">
                    <div className="col-span-6 sm:col-span-7">Student</div>
                    <div className="col-span-3 text-center">Status</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Actions</div>
                  </div>
                  
                  {students.map((student) => (
                    <div key={student.id} className="grid grid-cols-12 gap-4 p-3 border-b items-center hover:bg-muted/20 transition-colors">
                      <div className="col-span-6 sm:col-span-7 flex items-center gap-2 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0 border border-primary/20">
                          <AvatarImage src={student.avatarUrl} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20">{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <div className="font-medium truncate">{student.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex justify-center">
                        {getStatusBadge(student.status)}
                      </div>
                      
                      <div className="col-span-3 sm:col-span-2 flex justify-center gap-1">
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Present progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-present"></div>
                    <span className="text-sm font-medium">Present</span>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `75%` }}
                  ></div>
                </div>
              </div>

              {/* Absent progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-absent"></div>
                    <span className="text-sm font-medium">Absent</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `25%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View past attendance records here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
