
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, Users, Check, X, FileText, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentClass, setCurrentClass] = useState<string | null>("Mathematics 101");
  const currentDate = new Date();
  
  // Mock data for classes
  const classes = [
    {
      id: "math101",
      name: "Mathematics 101",
      grade: "Grade 10 - Room 203",
      time: "9:00 AM - 10:30 AM",
      students: 28
    },
    {
      id: "physics",
      name: "Physics",
      grade: "Grade 11 - Lab 105",
      time: "11:00 AM - 12:30 PM",
      students: 24
    },
    {
      id: "english",
      name: "English Literature",
      grade: "Grade 10 - Room 105",
      time: "1:30 PM - 3:00 PM",
      students: 30
    }
  ];
  
  // Mock data for students
  const students = [
    {
      id: "1",
      name: "Emma Thompson",
      email: "emma.t@school.edu",
      status: "absent",
      avatarUrl: ""
    },
    {
      id: "2",
      name: "Liam Johnson",
      email: "liam.j@school.edu",
      status: "excused",
      avatarUrl: ""
    },
    {
      id: "3",
      name: "Olivia Davis",
      email: "olivia.d@school.edu",
      status: "none",
      avatarUrl: ""
    },
    {
      id: "4",
      name: "Noah Wilson",
      email: "noah.w@school.edu",
      status: "absent",
      avatarUrl: ""
    },
    {
      id: "5",
      name: "Ava Martinez",
      email: "ava.m@school.edu",
      status: "excused",
      avatarUrl: ""
    }
  ];
  
  // Attendance stats for the current class
  const attendanceStats = {
    total: 10,
    present: 1,
    absent: 2,
    late: 2
  };
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check size={14} className="mr-1" /> Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-500 hover:bg-red-600"><X size={14} className="mr-1" /> Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock size={14} className="mr-1" /> Late</Badge>;
      case 'excused':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><FileText size={14} className="mr-1" /> Excused</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">MME-AT-TRACKING</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>Today: {format(currentDate, 'M/d/yyyy')}</span>
          </div>
          
          <Button onClick={() => navigate('/attendance')} className="whitespace-nowrap">
            Take Attendance
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="current-classes">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="current-classes" className="flex-1">Current Classes</TabsTrigger>
          <TabsTrigger value="statistics" className="flex-1">Statistics</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current-classes" className="space-y-6 mt-6">
          {/* Class cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{cls.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{cls.grade}</p>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{cls.time}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">Students: {cls.students}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleTakeAttendance(cls.id)}
                      size={isMobile ? "sm" : "default"}
                    >
                      Take Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Current class detail */}
          {currentClass && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Current Class: {currentClass}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Mark students as present, absent, or late. Changes are saved automatically.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background">
                      Total: {attendanceStats.total}
                    </Badge>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Present: {attendanceStats.present}
                    </Badge>
                    <Badge className="bg-red-500 hover:bg-red-600">
                      Absent: {attendanceStats.absent}
                    </Badge>
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      Late: {attendanceStats.late}
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
                
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/50 font-medium">
                    <div className="col-span-5 sm:col-span-4">Student</div>
                    <div className="col-span-4 sm:col-span-3 text-center">Status</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Actions</div>
                    <div className="hidden sm:block sm:col-span-3">Notes</div>
                  </div>
                  
                  {students.map((student) => (
                    <div key={student.id} className="grid grid-cols-12 gap-4 p-3 border-b items-center">
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={student.avatarUrl} />
                          <AvatarFallback className="text-xs">{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <div className="font-medium truncate">{student.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                        </div>
                      </div>
                      
                      <div className="col-span-4 sm:col-span-3 flex justify-center">
                        {getStatusBadge(student.status)}
                      </div>
                      
                      <div className="col-span-3 sm:col-span-2 flex justify-center gap-1">
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="hidden sm:block sm:col-span-3">
                        <Input placeholder="Add note..." className="h-8 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card className="mt-6">
            <CardHeader>
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
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `15%` }}
                  ></div>
                </div>
              </div>

              {/* Late progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-late"></div>
                    <span className="text-sm font-medium">Late</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `10%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="mt-6">
            <CardHeader>
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
