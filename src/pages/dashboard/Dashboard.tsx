
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockClasses } from "@/lib/mock-data";
import DashboardTabs from "./components/DashboardTabs";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0]?.id || "");
  const currentDate = new Date();
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MME-AT-TRACKING</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>Today: {format(currentDate, 'M/d/yyyy')}</span>
          </div>
          
          <Button variant="gradient" onClick={() => navigate('/attendance')} className="whitespace-nowrap">
            Take Attendance
          </Button>
        </div>
      </div>
      
      <DashboardTabs 
        selectedClassId={selectedClassId} 
        onClassSelect={handleClassSelect} 
        onTakeAttendance={handleTakeAttendance}
      />
    </div>
  );
};

export default Dashboard;
