
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronRight,
  ClipboardCheck,
  UserCheck,
  Clock,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Attendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedGrade, setSelectedGrade] = useState<string>("SE MME");
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Fetch grades for the dropdown
  const { data: gradesData = [], isLoading: isLoadingGrades } = useQuery({
    queryKey: ['attendanceGrades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('grade')
        .order('grade');
      
      if (error) {
        toast.error('Failed to load grades: ' + error.message);
        throw error;
      }
      
      // Get unique grades
      return [...new Set(data.map(cls => cls.grade))];
    },
  });
  
  // Fetch classes based on selected grade
  const { data: classesData = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classesForAttendance', selectedGrade],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:class_students(
            student:students(*)
          )
        `)
        .eq('grade', selectedGrade)
        .order('name');
      
      if (error) {
        toast.error('Failed to load classes: ' + error.message);
        throw error;
      }
      
      // Transform the data to match expected format
      return data.map(cls => ({
        ...cls,
        id: cls.id,
        name: cls.name,
        description: cls.description,
        schedule: cls.schedule,
        grade: cls.grade,
        students: cls.students?.map(s => ({
          id: s.student.id,
          name: s.student.name,
          studentId: s.student.student_id,
          email: s.student.email || '',
          avatarUrl: s.student.avatar_url
        })) || []
      }));
    },
  });
  
  const handleStartAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${formattedDate}`);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">Take and manage attendance records</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {gradesData.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subjects for {selectedGrade} - {format(date, "EEEE, MMMM d")}</CardTitle>
            <CardDescription>Select a subject to take attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingClasses ? (
              <div className="py-8 text-center">Loading subjects...</div>
            ) : classesData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No subjects found for {selectedGrade}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classesData.map((cls) => (
                  <div 
                    key={cls.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/10 transition-colors cursor-pointer"
                    onClick={() => handleStartAttendance(cls.id)}
                  >
                    <div className="bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <UserCheck size={24} />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-medium text-lg">{cls.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center sm:justify-start gap-1">
                          <Clock size={14} />
                          <span>{cls.schedule ? cls.schedule.split('-')[0].trim() : 'No schedule'}</span>
                        </div>
                        <div className="hidden sm:block">•</div>
                        <span>{cls.grade}</span>
                        <div className="hidden sm:block">•</div>
                        <span>{cls.students.length} students</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-center sm:justify-end">
                      <Badge variant="outline" className="bg-white">
                        <div className="flex -space-x-2 mr-2">
                          {cls.students.slice(0, 3).map((student) => (
                            <Avatar key={student.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={student.avatarUrl} />
                              <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs">{cls.students.length}</span>
                      </Badge>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAttendance(cls.id);
                        }}
                      >
                        <ClipboardCheck size={16} className="mr-2" />
                        Take Attendance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
