
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, FileText, Sparkles } from "lucide-react";
import { AttendanceStatus, Student } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentAttendanceRowProps {
  data: {
    student: Student;
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
                  <Sparkles className="text-primary" size={18} />
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

export default StudentAttendanceRow;
