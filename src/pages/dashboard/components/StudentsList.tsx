
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "present" | "absent" | "none";
}

interface StudentsListProps {
  students: Student[];
}

const StudentsList: React.FC<StudentsListProps> = ({ students }) => {
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
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 font-medium">
        <div className="col-span-6 sm:col-span-7">Student</div>
        <div className="col-span-3 text-center">Status</div>
        <div className="col-span-3 sm:col-span-2 text-center">Actions</div>
      </div>
      
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
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsList;
