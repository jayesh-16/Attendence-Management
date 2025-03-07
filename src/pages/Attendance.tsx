
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
  Clock
} from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Attendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
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
            <CardTitle>Classes for {format(date, "EEEE, MMMM d")}</CardTitle>
            <CardDescription>Select a class to take attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClasses.map((cls) => (
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
                        <span>{cls.schedule.split('-')[0].trim()}</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
