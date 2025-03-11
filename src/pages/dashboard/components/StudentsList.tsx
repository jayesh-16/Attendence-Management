
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "present" | "absent" | "none";
}

interface StudentsListProps {
  students: Student[];
  onMarkPresent?: (studentId: string) => void;
  onMarkAbsent?: (studentId: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  students,
  onMarkPresent,
  onMarkAbsent
}) => {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentId, setNewStudentId] = useState("");

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

  const handleAddStudent = () => {
    // In a real app, this would call an API to add the student
    console.log("Adding student:", {
      name: newStudentName,
      email: newStudentEmail,
      studentId: newStudentId
    });
    
    // Reset form
    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentId("");
    setIsAddingStudent(false);
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 font-medium">
          <div className="col-span-6 sm:col-span-7">Student</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-3 sm:col-span-2 text-center">Actions</div>
        </div>
        
        {students.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No students found</p>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => setIsAddingStudent(true)}
            >
              <UserPlus size={16} />
              Add Student
            </Button>
          </div>
        ) : (
          <>
            {students.map((student) => (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-3 border-b items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-6 sm:col-span-7 flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-primary/20">
                    <AvatarImage src={student.avatarUrl} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20">{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <div className="font-medium truncate">{student.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                  </div>
                </div>
                
                <div className="col-span-3 flex justify-center">
                  {getStatusBadge(student.status)}
                </div>
                
                <div className="col-span-3 sm:col-span-2 flex justify-center gap-1">
                  {onMarkPresent && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                      onClick={() => onMarkPresent(student.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {onMarkAbsent && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                      onClick={() => onMarkAbsent(student.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="p-3 flex justify-end">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => setIsAddingStudent(true)}
              >
                <UserPlus size={16} />
                Add Student
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input 
                id="name" 
                value={newStudentName} 
                onChange={(e) => setNewStudentName(e.target.value)} 
                placeholder="Enter student name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newStudentEmail} 
                onChange={(e) => setNewStudentEmail(e.target.value)} 
                placeholder="Enter student email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input 
                id="studentId" 
                value={newStudentId} 
                onChange={(e) => setNewStudentId(e.target.value)} 
                placeholder="Enter student ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="gradient" 
              onClick={handleAddStudent}
              disabled={!newStudentName || !newStudentEmail || !newStudentId}
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentsList;
