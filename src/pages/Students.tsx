
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, UserCheck, Mail, Phone, Check, X, Clock, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock student data
const mockStudents = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma.t@school.edu",
    phone: "555-123-4567",
    grade: "Grade 10",
    attendanceRate: 92,
    avatar: ""
  },
  {
    id: "2",
    name: "Liam Johnson",
    email: "liam.j@school.edu",
    phone: "555-234-5678",
    grade: "Grade 11",
    attendanceRate: 85,
    avatar: ""
  },
  {
    id: "3",
    name: "Olivia Davis",
    email: "olivia.d@school.edu",
    phone: "555-345-6789",
    grade: "Grade 10",
    attendanceRate: 98,
    avatar: ""
  },
  {
    id: "4",
    name: "Noah Wilson",
    email: "noah.w@school.edu",
    phone: "555-456-7890",
    grade: "Grade 11",
    attendanceRate: 78,
    avatar: ""
  },
  {
    id: "5",
    name: "Ava Martinez",
    email: "ava.m@school.edu",
    phone: "555-567-8901",
    grade: "Grade 10",
    attendanceRate: 90,
    avatar: ""
  },
];

const Students = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter students based on search query
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get attendance status indicator
  const getAttendanceIndicator = (rate: number) => {
    if (rate >= 90) return { color: "bg-green-500", icon: <Check className="h-4 w-4" />, label: "Excellent" };
    if (rate >= 80) return { color: "bg-amber-500", icon: <Clock className="h-4 w-4" />, label: "Good" };
    return { color: "bg-red-500", icon: <X className="h-4 w-4" />, label: "Needs Improvement" };
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student data and attendance records</p>
        </div>
        
        <Button variant="gradient" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>
      
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
          <div>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>View and manage student information</CardDescription>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border rounded-md divide-y shadow-sm overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No students found</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const attendance = getAttendanceIndicator(student.attendanceRate);
                
                return (
                  <div key={student.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                    <div className="sm:col-span-4 flex items-center gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0 border border-primary/20">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          {student.name}
                          <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-primary/10 to-secondary/10">{student.grade}</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-primary" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1">
                            <Phone className="h-3 w-3 text-primary" />
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3 flex items-center sm:justify-center mt-2 sm:mt-0">
                      <Badge className={`${attendance.color} flex items-center gap-1 text-white shadow-sm`}>
                        {attendance.icon}
                        <span>{student.attendanceRate}% Attendance</span>
                      </Badge>
                    </div>
                    
                    <div className="sm:col-span-5 flex justify-end sm:justify-center gap-2 mt-2 sm:mt-0">
                      <Button variant="gradient" size={isMobile ? "sm" : "default"} className="gap-1">
                        <UserCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">View Attendance</span>
                      </Button>
                      <Button variant="outline" size={isMobile ? "sm" : "default"} className="bg-white/50 hover:bg-white">
                        <span className="hidden sm:inline">Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
