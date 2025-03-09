
import React from 'react';
import { Button } from "@/components/ui/button";
import { SaveAll, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceActionsProps {
  saveAllAttendance: () => void;
  onAddStudent?: () => void;
}

const AttendanceActions = ({ saveAllAttendance, onAddStudent }: AttendanceActionsProps) => {
  const { toast } = useToast();

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
    </div>
  );
};

export default AttendanceActions;
