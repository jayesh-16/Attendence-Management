
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HistoryViewProps {
  selectedClassId: string;
}

const HistoryView: React.FC<HistoryViewProps> = ({ selectedClassId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Mock attendance data - in a real app this would come from an API
  const mockAttendanceData = [
    { date: '2023-03-01', present: 22, absent: 3 },
    { date: '2023-03-05', present: 20, absent: 5 },
    { date: '2023-03-10', present: 23, absent: 2 },
    { date: '2023-03-15', present: 21, absent: 4 },
    { date: '2023-03-20', present: 24, absent: 1 },
  ];
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Attendance History</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Recent Attendance Records
              </h3>
              <div className="space-y-3">
                {mockAttendanceData.map((record, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-100 transition-all hover:shadow-md hover-scale"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="font-medium">{format(new Date(record.date), 'MMMM d, yyyy')}</span>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500">Present: {record.present}</Badge>
                      <Badge className="bg-red-500">Absent: {record.absent}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">Attendance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Classes</span>
                  <Badge variant="outline" className="font-medium">{mockAttendanceData.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Attendance</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary font-medium">92%</Badge>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Monthly Attendance Trend</h4>
                  <div className="h-24 flex items-end space-x-2">
                    {mockAttendanceData.map((record, index) => {
                      const percentage = (record.present / (record.present + record.absent)) * 100;
                      return (
                        <div 
                          key={index} 
                          className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t-md transition-all hover:opacity-80"
                          style={{ 
                            height: `${percentage}%`,
                            animationDelay: `${index * 0.15}s`,
                            animation: 'animate-scale-in 0.5s ease-out forwards'
                          }}
                        >
                          <div className="w-full h-full" title={`${percentage.toFixed(0)}%`}></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{format(new Date(mockAttendanceData[0].date), 'MMM d')}</span>
                    <span>{format(new Date(mockAttendanceData[mockAttendanceData.length - 1].date), 'MMM d')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
