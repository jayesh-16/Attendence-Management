
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ChevronLeft, 
  Search, 
  Check, 
  X, 
  Clock, 
  FileText,
  CalendarClock,
  SaveAll,
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
  BadgeAlert,
  FileSparkles
} from "lucide-react";
import { 
  mockClasses, 
  getStudentsWithAttendance 
} from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AttendanceStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AttendanceSession = () => {
  const { classId, date } = useParams<{ classId: string; date: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  
  // Find the class
  const currentClass = mockClasses.find(c => c.id === classId);
  
  // Get attendance data
  const [attendanceData, setAttendanceData] = useState<{
    student: {
      id: string;
      name: string;
      avatarUrl?: string;
      studentId: string;
      email: string;
    };
    status: AttendanceStatus;
    note?: string;
  }[]>([]);
  
  useEffect(() => {
    if (classId && date) {
      const data = getStudentsWithAttendance(classId, date);
      setAttendanceData(data);
    }
  }, [classId, date]);
  
  if (!currentClass) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Class not found</p>
      </div>
    );
  }
  
  // Filter students based on search query
  const filteredStudents = attendanceData.filter(item => 
    item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count statistics
  const stats = {
    present: attendanceData.filter(item => item.status === "present").length,
    absent: attendanceData.filter(item => item.status === "absent").length,
    late: attendanceData.filter(item => item.status === "late").length,
    excused: attendanceData.filter(item => item.status === "excused").length,
    total: attendanceData.length,
  };
  
  // Update attendance status
  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.student.id === studentId 
          ? { ...item, status } 
          : item
      )
    );
    
    // Show feedback
    toast({
      title: "Status updated",
      description: `Student marked as ${status}`,
      duration: 1500,
    });
  };
  
  // Add or update note
  const openNoteDialog = (studentId: string) => {
    const student = attendanceData.find(item => item.student.id === studentId);
    setSelectedStudent(studentId);
    setCurrentNote(student?.note || "");
    setNoteDialogOpen(true);
  };
  
  const saveNote = () => {
    if (!selectedStudent) return;
    
    setAttendanceData(prev => 
      prev.map(item => 
        item.student.id === selectedStudent 
          ? { ...item, note: currentNote } 
          : item
      )
    );
    
    setNoteDialogOpen(false);
    setSelectedStudent(null);
    
    // Show feedback
    toast({
      title: "Note saved",
      description: "Attendance note has been updated",
      duration: 1500,
    });
  };
  
  // Save all attendance
  const saveAllAttendance = () => {
    // In a real app, this would save to database
    toast({
      title: "Attendance saved",
      description: "All attendance records have been saved successfully",
    });
    
    setTimeout(() => {
      navigate("/attendance");
    }, 1500);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/attendance")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{currentClass.name}</h1>
            <p className="text-muted-foreground mt-1">
              Attendance for {format(parseISO(date || ""), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={saveAllAttendance} className="gap-2">
            <SaveAll size={16} />
            Save Attendance
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle>Student Attendance</CardTitle>
                <Badge className="ml-2">{currentClass.students.length} Students</Badge>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Users size={14} />
                    <span>All ({stats.total})</span>
                  </TabsTrigger>
                  <TabsTrigger value="present" className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-present" />
                    <span>Present ({stats.present})</span>
                  </TabsTrigger>
                  <TabsTrigger value="absent" className="flex items-center gap-2">
                    <XCircle size={14} className="text-absent" />
                    <span>Absent ({stats.absent})</span>
                  </TabsTrigger>
                  <TabsTrigger value="late" className="flex items-center gap-2">
                    <BadgeAlert size={14} className="text-late" />
                    <span>Late ({stats.late})</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="border rounded-md divide-y">
                    {filteredStudents.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No students found</p>
                      </div>
                    ) : (
                      filteredStudents.map((item) => (
                        <StudentAttendanceRow
                          key={item.student.id}
                          data={item}
                          updateStatus={updateStatus}
                          openNoteDialog={openNoteDialog}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="present" className="mt-4">
                  <div className="border rounded-md divide-y">
                    {filteredStudents.filter(item => item.status === "present").length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No present students</p>
                      </div>
                    ) : (
                      filteredStudents
                        .filter(item => item.status === "present")
                        .map((item) => (
                          <StudentAttendanceRow
                            key={item.student.id}
                            data={item}
                            updateStatus={updateStatus}
                            openNoteDialog={openNoteDialog}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="absent" className="mt-4">
                  <div className="border rounded-md divide-y">
                    {filteredStudents.filter(item => item.status === "absent").length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No absent students</p>
                      </div>
                    ) : (
                      filteredStudents
                        .filter(item => item.status === "absent")
                        .map((item) => (
                          <StudentAttendanceRow
                            key={item.student.id}
                            data={item}
                            updateStatus={updateStatus}
                            openNoteDialog={openNoteDialog}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="late" className="mt-4">
                  <div className="border rounded-md divide-y">
                    {filteredStudents.filter(item => item.status === "late").length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No late students</p>
                      </div>
                    ) : (
                      filteredStudents
                        .filter(item => item.status === "late")
                        .map((item) => (
                          <StudentAttendanceRow
                            key={item.student.id}
                            data={item}
                            updateStatus={updateStatus}
                            openNoteDialog={openNoteDialog}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Class</div>
                <div className="font-medium">{currentClass.name}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Schedule</div>
                <div className="flex items-center gap-2">
                  <CalendarClock size={16} className="text-muted-foreground" />
                  <span className="font-medium">{currentClass.schedule}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Grade</div>
                <div className="font-medium">{currentClass.grade}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{currentClass.description}</div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Attendance Summary</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-indicator bg-present"></div>
                      <span>Present</span>
                    </div>
                    <div className="font-medium">{stats.present}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-indicator bg-absent"></div>
                      <span>Absent</span>
                    </div>
                    <div className="font-medium">{stats.absent}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-indicator bg-late"></div>
                      <span>Late</span>
                    </div>
                    <div className="font-medium">{stats.late}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="status-indicator bg-excused"></div>
                      <span>Excused</span>
                    </div>
                    <div className="font-medium">{stats.excused}</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full gap-2">
                <FileSparkles size={16} />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Note dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendance Note</DialogTitle>
            <DialogDescription>
              Add a note explaining the attendance status (e.g., reason for absence)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter attendance note here..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StudentAttendanceRowProps {
  data: {
    student: {
      id: string;
      name: string;
      avatarUrl?: string;
      studentId: string;
      email: string;
    };
    status: AttendanceStatus;
    note?: string;
  };
  updateStatus: (studentId: string, status: AttendanceStatus) => void;
  openNoteDialog: (studentId: string) => void;
}

const StudentAttendanceRow = ({ data, updateStatus, openNoteDialog }: StudentAttendanceRowProps) => {
  const { student, status, note } = data;
  
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present": return "bg-present";
      case "absent": return "bg-absent";
      case "late": return "bg-late";
      case "excused": return "bg-excused";
      default: return "bg-gray-400";
    }
  };
  
  const getStatusLabel = (status: AttendanceStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4 animate-scale-in">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.avatarUrl} />
          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{student.name}</h3>
            <div className={cn("status-indicator", getStatusColor(status))}></div>
          </div>
          <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={status === "present" ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full attendance-button",
                  status === "present" ? "bg-present hover:bg-present/90" : "text-muted-foreground"
                )}
                onClick={() => updateStatus(student.id, "present")}
              >
                <Check className={status === "present" ? "text-white" : ""} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as present</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={status === "absent" ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full attendance-button",
                  status === "absent" ? "bg-absent hover:bg-absent/90" : "text-muted-foreground"
                )}
                onClick={() => updateStatus(student.id, "absent")}
              >
                <X className={status === "absent" ? "text-white" : ""} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as absent</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={status === "late" ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full attendance-button",
                  status === "late" ? "bg-late hover:bg-late/90" : "text-muted-foreground"
                )}
                onClick={() => updateStatus(student.id, "late")}
              >
                <Clock className={status === "late" ? "text-white" : ""} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as late</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={status === "excused" ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full attendance-button",
                  status === "excused" ? "bg-excused hover:bg-excused/90" : "text-muted-foreground"
                )}
                onClick={() => updateStatus(student.id, "excused")}
              >
                <FileText className={status === "excused" ? "text-white" : ""} size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as excused</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full attendance-button"
                onClick={() => openNoteDialog(student.id)}
              >
                {note ? (
                  <FileSparkles className="text-primary" size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{note ? "Edit note" : "Add note"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AttendanceSession;
