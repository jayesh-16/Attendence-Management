
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  // Example percentages - in a real app these would come from your data source
  const presentPercentage = 75;
  const absentPercentage = 15;
  const latePercentage = 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Attendance tracking at a glance</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Overall attendance statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Present progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-present"></div>
                <span className="text-sm font-medium">Present</span>
              </div>
              <span className="text-sm font-medium">{presentPercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${presentPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Absent progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-absent"></div>
                <span className="text-sm font-medium">Absent</span>
              </div>
              <span className="text-sm font-medium">{absentPercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all"
                style={{ width: `${absentPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Late progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="status-indicator bg-late"></div>
                <span className="text-sm font-medium">Late</span>
              </div>
              <span className="text-sm font-medium">{latePercentage}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${latePercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
