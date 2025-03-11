
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-3">
      {classes.map((cls) => (
        <Card 
          key={cls.id} 
          className={`overflow-hidden border-none hover:bg-secondary/40 transition-all duration-200 cursor-pointer ${
            cls.id === selectedClassId ? 'ring-2 ring-primary shadow-sm bg-secondary/30' : 'bg-white/80'
          }`}
          onClick={() => onClassSelect(cls.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{cls.name}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {cls.grade.replace('MME', '')}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1.5 text-primary/70" />
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1.5 text-primary/70" />
                  <span>{cls.students.length} students</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {classes.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No classes found for this grade.
        </div>
      )}
    </div>
  );
};

export default ClassesList;
