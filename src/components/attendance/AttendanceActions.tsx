
import React from 'react';
import { Button } from "@/components/ui/button";
import { SaveAll } from "lucide-react";

interface AttendanceActionsProps {
  saveAllAttendance: () => void;
}

const AttendanceActions = ({ saveAllAttendance }: AttendanceActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button onClick={saveAllAttendance} className="gap-2">
        <SaveAll size={16} />
        Save Attendance
      </Button>
    </div>
  );
};

export default AttendanceActions;
