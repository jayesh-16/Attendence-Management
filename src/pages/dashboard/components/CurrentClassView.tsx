
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Calendar, Clock } from "lucide-react";
import { mockClasses, calculateAttendanceStats, generateAttendanceRecords } from "@/lib/mock-data";
import StudentsList from './StudentsList';
import { format } from 'date-fns';

interface CurrentClassViewProps {
  selectedClassId: string;
}

const CurrentClassView: React.FC<CurrentClassViewProps> = ({ selectedClassId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get class data and records
  const selectedClass = mockClasses.find(cls => cls.id === selectedClassId) || mockClasses[0];
  const attendanceRecords = selectedClass ? generateAttendanceRecords(selectedClass.id, selectedClass.students) : [];
  const stats = calculateAttendanceStats(attendanceRecords);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStudentAdded = () => {
    // In a real app, this would refresh the class data
    console.log("Student added to class", selectedClassId);
  };

  const currentDate = new Date();

  if (!selectedClass) {
    return (
      <Card className="mt-6 animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No class selected. Please select a class from the list.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-xl md:text-2xl">
                {selectedClass.name}
              </CardTitle>
              <Badge className="bg-gradient-primary text-white">{selectedClass.grade}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Mark students as present or absent. Changes are saved automatically.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{format(currentDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{selectedClass.schedule}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>Total: {stats.total}</span>
            </Badge>
            <Badge className="bg-green-500 hover:bg-green-600 flex items-center">
              Present: {stats.present}
            </Badge>
            <Badge className="bg-red-500 hover:bg-red-600 flex items-center">
              Absent: {stats.absent}
            </Badge>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-9 w-full bg-white/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        <StudentsList 
          classId={selectedClassId}
          grade={selectedClass?.grade || ''}
          onMarkPresent={(studentId) => console.log("Mark present:", studentId)}
          onMarkAbsent={(studentId) => console.log("Mark absent:", studentId)}
          onStudentAdded={handleStudentAdded}
        />
      </CardContent>
    </Card>
  );
};

export default CurrentClassView;
