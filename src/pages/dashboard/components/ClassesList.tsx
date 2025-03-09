
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Class } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClassesListProps {
  classes: Class[];
  selectedClassId: string;
  onClassSelect: (classId: string) => void;
  onTakeAttendance: (classId: string) => void;
}

const ClassesList: React.FC<ClassesListProps> = ({
  classes,
  selectedClassId,
  onClassSelect,
  onTakeAttendance
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((cls) => (
        <Card 
          key={cls.id} 
          className={`overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30 hover-scale cursor-pointer ${cls.id === selectedClassId ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onClassSelect(cls.id)}
        >
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
            <CardTitle className="text-xl">{cls.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{cls.grade}</p>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm">{cls.schedule}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Students: {cls.students.length}</span>
              </div>
              
              <Button 
                variant="gradient"
                onClick={(e) => {
                  e.stopPropagation();
                  onTakeAttendance(cls.id);
                }}
                size={isMobile ? "sm" : "default"}
              >
                Take Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassesList;
