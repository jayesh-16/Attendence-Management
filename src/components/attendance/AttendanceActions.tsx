
import React from 'react';
import { Button } from "@/components/ui/button";
import { SaveAll, UserPlus } from "lucide-react";

interface AttendanceActionsProps {
  saveAllAttendance: () => void;
  onAddStudent?: () => void;
}

const AttendanceActions = ({ saveAllAttendance, onAddStudent }: AttendanceActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button onClick={saveAllAttendance} className="gap-2">
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
