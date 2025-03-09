
import React from 'react';
import { CalendarClock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Class } from "@/types";

interface ClassDetailsCardProps {
  currentClass: Class;
  stats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
}

const ClassDetailsCard = ({ currentClass, stats }: ClassDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Class</div>
            <div className="font-medium">{currentClass.name}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Schedule</div>
            <div className="flex items-center gap-2">
              <CalendarClock size={16} className="text-muted-foreground" />
              <span className="font-medium">{currentClass.schedule}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Grade</div>
            <div className="font-medium">{currentClass.grade}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-sm">{currentClass.description}</div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Attendance Summary</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-indicator bg-present"></div>
                  <span>Present</span>
                </div>
                <div className="font-medium">{stats.present}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-indicator bg-absent"></div>
                  <span>Absent</span>
                </div>
                <div className="font-medium">{stats.absent}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-indicator bg-late"></div>
                  <span>Late</span>
                </div>
                <div className="font-medium">{stats.late}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-indicator bg-excused"></div>
                  <span>Excused</span>
                </div>
                <div className="font-medium">{stats.excused}</div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full gap-2">
            <Sparkles size={16} />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassDetailsCard;
