
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
import { Input } from "@/components/ui/input";
import { 
  Search,
  BookOpen,
  Plus,
  Clock,
  CalendarClock,
  Users,
  MoreHorizontal,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Classes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Filter classes based on search query
  const filteredClasses = mockClasses.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${today}`);
  };

  // Get unique grades for displaying badges
  const getGradeBadgeColor = (grade: string) => {
    switch(grade) {
      case "SE MME":
        return "bg-blue-500";
      case "TE MME":
        return "bg-green-500";
      case "BE MME":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Classes</h1>
          <p className="text-muted-foreground mt-1">Manage MME department classes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus size={16} />
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Engineering Classes</CardTitle>
                <CardDescription className="mt-1.5">Mechanical Engineering Department Classes</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredClasses.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No classes found</p>
                </div>
              ) : (
                filteredClasses.map((cls) => (
                  <div 
                    key={cls.id}
                    className="border rounded-lg p-5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <GraduationCap size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{cls.name}</h3>
                                <Badge className={`${getGradeBadgeColor(cls.grade)} text-white`}>{cls.grade}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{cls.grade}</p>
                            </div>
                          </div>
                          
                          <div className="hidden sm:block">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Class</DropdownMenuItem>
                                <DropdownMenuItem>View Attendance</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <p className="text-sm">{cls.description}</p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarClock size={16} className="text-muted-foreground" />
                              <span>{cls.schedule}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-muted-foreground" />
                              <span>{cls.students.length} Students</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center gap-4 justify-between sm:justify-center sm:border-l sm:pl-4">
                        <div className="flex -space-x-2">
                          {cls.students.slice(0, 4).map((student) => (
                            <Avatar key={student.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={student.avatarUrl} />
                              <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {cls.students.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
                              +{cls.students.length - 4}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => handleTakeAttendance(cls.id)}
                          className="gap-2"
                        >
                          <UserCheck size={16} />
                          Take Attendance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classes;
