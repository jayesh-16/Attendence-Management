
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
  GraduationCap,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Classes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  
  // New state for class form
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("");
  const [newClassSchedule, setNewClassSchedule] = useState("");
  
  // Fetch classes with students count
  const { data: classesData = [], isLoading, refetch: refetchClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:class_students(count)
        `);
      
      if (error) {
        toast.error('Failed to load classes: ' + error.message);
        throw error;
      }
      
      // Transform data to include student count
      return data.map(cls => ({
        ...cls,
        studentCount: cls.students[0]?.count || 0
      }));
    },
  });
  
  // Filter classes based on search query
  const filteredClasses = classesData.filter(cls => 
    searchQuery ? (
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.grade?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
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
  
  const resetForm = () => {
    setNewClassName("");
    setNewClassDescription("");
    setNewClassGrade("");
    setNewClassSchedule("");
  };
  
  const handleAddClass = async () => {
    try {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You need to be logged in to add a class');
        return;
      }
      
      // Add the class to the database
      const { error } = await supabase
        .from('classes')
        .insert({
          name: newClassName,
          description: newClassDescription,
          grade: newClassGrade,
          schedule: newClassSchedule,
          created_by: user.id
        });
      
      if (error) {
        toast.error('Failed to add class: ' + error.message);
        return;
      }
      
      toast.success('Class added successfully!');
      refetchClasses();
      setIsAddClassOpen(false);
      resetForm();
      
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };
  
  const handleDeleteClass = async (classId: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
      
      if (error) {
        toast.error('Failed to delete class: ' + error.message);
        return;
      }
      
      toast.success('Class deleted successfully!');
      refetchClasses();
      
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Classes</h1>
          <p className="text-muted-foreground mt-1">Manage MME department classes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => setIsAddClassOpen(true)}
          >
            <Plus size={16} />
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
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
          <CardContent className="p-4">
            <div className="grid gap-4">
              {isLoading ? (
                <div className="py-12 text-center">Loading classes...</div>
              ) : filteredClasses.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No classes found</p>
                </div>
              ) : (
                filteredClasses.map((cls) => (
                  <div 
                    key={cls.id}
                    className="border rounded-lg p-5 hover:bg-muted/10 transition-colors hover:shadow-md shadow-sm bg-white"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                              <GraduationCap size={20} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{cls.name}</h3>
                                <Badge className={`${getGradeBadgeColor(cls.grade)} text-white shadow-sm`}>{cls.grade}</Badge>
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
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Class
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-500 focus:text-red-500"
                                  onClick={() => handleDeleteClass(cls.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Class
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <p className="text-sm">{cls.description}</p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarClock size={16} className="text-primary" />
                              <span>{cls.schedule}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-primary" />
                              <span>{cls.studentCount} Students</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center gap-4 justify-between sm:justify-center sm:border-l sm:pl-4">
                        <div className="flex -space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-background text-xs font-medium">
                            {cls.studentCount}
                          </div>
                        </div>
                        
                        <Button
                          variant="default"
                          onClick={() => handleTakeAttendance(cls.id)}
                          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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
      
      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input 
                id="className" 
                value={newClassName} 
                onChange={(e) => setNewClassName(e.target.value)} 
                placeholder="Enter class name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newClassDescription} 
                onChange={(e) => setNewClassDescription(e.target.value)} 
                placeholder="Enter class description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input 
                id="schedule" 
                value={newClassSchedule} 
                onChange={(e) => setNewClassSchedule(e.target.value)} 
                placeholder="E.g., Mon, Wed, Fri 10:00-11:30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={newClassGrade} onValueChange={setNewClassGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SE MME">SE MME</SelectItem>
                  <SelectItem value="TE MME">TE MME</SelectItem>
                  <SelectItem value="BE MME">BE MME</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddClassOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleAddClass}
              disabled={!newClassName || !newClassGrade || !newClassSchedule}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
