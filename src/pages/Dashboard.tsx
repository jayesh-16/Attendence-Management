
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  CalendarCheck, 
  Users, 
  BookOpen, 
  ChevronRight, 
  Calendar,
  BarChart,
  Clock,
  ClipboardCheck
} from "lucide-react";
import { mockClasses, generateAttendanceRecords, calculateAttendanceStats } from "@/lib/mock-data";
import { format, startOfDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Get the first class for quick attendance
  const firstClass = mockClasses[0];
  const recentClass = mockClasses[1];
  
  // Calculate today's attendance stats for the first class
  const todayAttendance = generateAttendanceRecords(
    firstClass.id, 
    firstClass.students
  ).filter(record => record.date === today);
  
  const stats = calculateAttendanceStats(todayAttendance);
  
  // Get overall attendance stats across all classes
  const allAttendance = mockClasses.flatMap(cls => 
    generateAttendanceRecords(cls.id, cls.students)
  );
  
  const overallStats = calculateAttendanceStats(allAttendance);
  
  const presentPercentage = Math.round((overallStats.present / overallStats.total) * 100);
  const absentPercentage = Math.round((overallStats.absent / overallStats.total) * 100);
  const latePercentage = Math.round((overallStats.late / overallStats.total) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <Button 
          onClick={() => navigate(`/attendance/${firstClass.id}/${today}`)}
          className="gap-2"
        >
          <ClipboardCheck size={16} />
          Take Attendance
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active classes this semester
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClasses.reduce((sum, cls) => sum + cls.students.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Students in your classes
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present} / {stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Students present today
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Overall attendance rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's classes and attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes for {format(new Date(), "EEEE, MMMM d")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClasses.slice(0, 3).map((cls, index) => (
                <div key={cls.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors cursor-pointer" onClick={() => navigate(`/attendance/${cls.id}/${today}`)}>
                  <div className="bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">{cls.schedule.split('-')[0].trim()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {cls.students.slice(0, 3).map((student) => (
                        <Avatar key={student.id} className="h-7 w-7 border-2 border-background">
                          <AvatarImage src={student.avatarUrl} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">+{cls.students.length - 3}</span>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={() => navigate('/classes')} className="w-full">
                View All Classes
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
            <CardDescription>Overall class attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-present"></div>
                    <span className="text-sm font-medium">Present</span>
                  </div>
                  <span className="text-sm font-medium">{presentPercentage}%</span>
                </div>
                <Progress value={presentPercentage} className="h-2 bg-muted" indicatorClassName="bg-present" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-absent"></div>
                    <span className="text-sm font-medium">Absent</span>
                  </div>
                  <span className="text-sm font-medium">{absentPercentage}%</span>
                </div>
                <Progress value={absentPercentage} className="h-2 bg-muted" indicatorClassName="bg-absent" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="status-indicator bg-late"></div>
                    <span className="text-sm font-medium">Late</span>
                  </div>
                  <span className="text-sm font-medium">{latePercentage}%</span>
                </div>
                <Progress value={latePercentage} className="h-2 bg-muted" indicatorClassName="bg-late" />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate('/reports')}>
                  <BarChart size={16} className="mr-2" />
                  View Detailed Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentClass.students.slice(0, 10).map((student, index) => {
                // Deterministic but varied statuses
                const statuses: Array<"present" | "absent" | "late" | "excused"> = ["present", "present", "present", "late", "absent", "present", "present", "present", "excused", "present"];
                const status = statuses[index % statuses.length];
                
                return (
                  <div key={student.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatarUrl} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{student.name}</span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          status === "present" ? "bg-green-100 text-green-800" :
                          status === "absent" ? "bg-red-100 text-red-800" :
                          status === "late" ? "bg-amber-100 text-amber-800" :
                          "bg-indigo-100 text-indigo-800"
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {recentClass.name} - {format(startOfDay(new Date()), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
