
import React from 'react';
import { Button } from "@/components/ui/button";
import { SaveAll, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface AttendanceActionsProps {
  saveAllAttendance: () => void;
  onAddStudent?: () => void;
  classId?: string;
}

const AttendanceActions = ({ saveAllAttendance, onAddStudent, classId }: AttendanceActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveAttendance = () => {
    try {
      saveAllAttendance();
      toast({
        title: "Success",
        description: "Attendance saved successfully",
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  const handleTakeAttendance = () => {
    if (classId) {
      const today = format(new Date(), 'yyyy-MM-dd');
      navigate(`/attendance/${classId}/${today}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button onClick={handleSaveAttendance} className="gap-2">
        <SaveAll size={16} />
        Save Attendance
      </Button>
      {onAddStudent && (
        <Button variant="outline" onClick={onAddStudent} className="gap-2">
          <UserPlus size={16} />
          Add Student
        </Button>
      )}
      {classId && (
        <Button 
          variant="default"
          onClick={handleTakeAttendance}
          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
        >
          Take Attendance
        </Button>
      )}
    </div>
  );
};

export default AttendanceActions;
