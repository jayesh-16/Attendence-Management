
import { useState } from "react";
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
  UserPlus, 
  FileDown,
  Mail,
  Phone,
  Check,
  BookOpen,
} from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all students from all classes
  const allStudents = mockClasses.flatMap(cls => cls.students);
  
  // Remove duplicates by id
  const uniqueStudents = [...new Map(allStudents.map(student => [student.id, student])).values()];
  
  // Filter students based on search query
  const filteredStudents = uniqueStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">Manage your students</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <UserPlus size={16} />
            Add Student
          </Button>
          <Button variant="outline" className="gap-2">
            <FileDown size={16} />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription className="mt-1.5">A list of all students in your classes</CardDescription>
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
          <div className="border rounded-md">
            <div className="grid grid-cols-10 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-4">Student</div>
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="divide-y">
              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No students found</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="grid grid-cols-10 gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen size={12} />
                          <span>
                            {mockClasses.filter(cls => 
                              cls.students.some(s => s.id === student.id)
                            ).length} Classes
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <Badge variant="outline" className="bg-muted/50 hover:bg-muted font-mono text-xs">
                        {student.studentId}
                      </Badge>
                    </div>
                    
                    <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} />
                      <span className="truncate">{student.email}</span>
                    </div>
                    
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Attendance History</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
