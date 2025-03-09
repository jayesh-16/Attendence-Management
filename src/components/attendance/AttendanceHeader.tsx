
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Class } from "@/types";

interface AttendanceHeaderProps {
  currentClass: Class;
  date: string;
}

const AttendanceHeader = ({ currentClass, date }: AttendanceHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default AttendanceHeader;
