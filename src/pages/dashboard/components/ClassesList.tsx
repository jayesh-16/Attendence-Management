
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar } from "lucide-react";
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
    <div className="space-y-4">
      {classes.map((cls, index) => (
        <Card 
          key={cls.id} 
          className={`overflow-hidden border-none shadow-sm bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-light/10 hover-scale cursor-pointer transition-all duration-300 animate-fade-in ${cls.id === selectedClassId ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => onClassSelect(cls.id)}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-0">
            <div className="grid grid-cols-12 items-center">
              <div className={`col-span-2 bg-gradient-to-br from-primary/20 to-secondary/20 ${cls.id === selectedClassId ? 'from-primary/40 to-secondary/40' : ''} h-full flex items-center justify-center p-4`}>
                <div className="text-center">
                  <div className="text-xl font-bold">{cls.grade.replace('MME', '')}</div>
                  <div className="text-xs text-muted-foreground">MME</div>
                </div>
              </div>
              
              <div className="col-span-7 p-4 pl-5">
                <h3 className="text-md font-medium truncate">{cls.name}</h3>
                <div className="flex flex-col mt-1 gap-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1 text-primary" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1 text-primary" />
                    <span>Students: {cls.students.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 p-3 flex justify-center">
                <Button 
                  variant="gradient"
                  size="sm"
                  className="w-full h-8 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTakeAttendance(cls.id);
                  }}
                >
                  <Calendar className="h-3 w-3" />
                  Attendance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {classes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No classes found for this grade.
        </div>
      )}
    </div>
  );
};

export default ClassesList;
