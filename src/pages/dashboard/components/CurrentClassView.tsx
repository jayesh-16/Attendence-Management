
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockClasses, calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";

interface CurrentClassViewProps {
  selectedClassId: string;
}

const CurrentClassView: React.FC<CurrentClassViewProps> = ({ selectedClassId }) => {
  // Get class data and records
  const selectedClass = mockClasses.find(cls => cls.id === selectedClassId) || mockClasses[0];
  const attendanceRecords = selectedClass ? generateAttendanceRecords(selectedClass.id, selectedClass.students) : [];
  const stats = calculateAttendanceStats(attendanceRecords);
  
  // Mock students for the selected class with simplified status
  const students = selectedClass ? selectedClass.students.slice(0, 5).map(student => ({
    ...student,
    status: ["present", "absent", "none"][Math.floor(Math.random() * 3)] as "present" | "absent" | "none"
  })) : [];
  
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
        
        <StudentsList students={students} />
      </CardContent>
    </Card>
  );
};

export default CurrentClassView;
