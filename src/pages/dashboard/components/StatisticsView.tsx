
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatisticsView: React.FC = () => {
  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
        <CardTitle>Attendance Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Present progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="status-indicator bg-present"></div>
              <span className="text-sm font-medium">Present</span>
            </div>
            <span className="text-sm font-medium">75%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `75%` }}
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
            <span className="text-sm font-medium">25%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all"
              style={{ width: `25%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsView;
