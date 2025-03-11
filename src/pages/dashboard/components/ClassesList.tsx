
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, GraduationCap } from "lucide-react";
import { Class } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

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
          className={`overflow-hidden border-none shadow-sm hover:shadow-md bg-white transition-all duration-200 hover:translate-y-[-2px] cursor-pointer ${cls.id === selectedClassId ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onClassSelect(cls.id)}
        >
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <p className="text-muted-foreground text-xs">{cls.grade}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
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
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onTakeAttendance(cls.id);
                }}
                size={isMobile ? "sm" : "default"}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
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
