
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import ClassesList from './ClassesList';
import CurrentClassView from './CurrentClassView';
import HistoryView from './HistoryView';
import StatisticsView from './StatisticsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  selectedClassId: string;
  onClassSelect: (classId: string) => void;
  onTakeAttendance: (classId: string) => void;
  onGradeSelect?: (grade: string) => void;
}

const DashboardTabs = ({ 
  selectedClassId, 
  onClassSelect, 
  onTakeAttendance,
  onGradeSelect 
}) => {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedGrade, setSelectedGrade] = useState<string>("SE MME");
  
  const classesForGrade = mockClasses.filter(cls => cls.grade === selectedGrade);
  
  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    if (onGradeSelect) {
      onGradeSelect(grade);
    }
    
    const classInGrade = classesForGrade.find(cls => cls.id === selectedClassId);
    if (!classInGrade && classesForGrade.length > 0) {
      onClassSelect(classesForGrade[0].id);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <Card className="border-none overflow-hidden shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-6">
                <Tabs defaultValue={selectedGrade} onValueChange={handleGradeSelect}>
                  <TabsList className="grid grid-cols-3 w-full bg-secondary/50">
                    <TabsTrigger value="SE MME">SE MME</TabsTrigger>
                    <TabsTrigger value="TE MME">TE MME</TabsTrigger>
                    <TabsTrigger value="BE MME">BE MME</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6 overflow-auto max-h-[calc(100vh-360px)] custom-scrollbar">
                    <ClassesList 
                      classes={classesForGrade}
                      selectedClassId={selectedClassId}
                      onClassSelect={onClassSelect}
                      onTakeAttendance={onTakeAttendance}
                    />
                    
                    <div className="mt-6">
                      <Button 
                        variant="default" 
                        className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
                        onClick={() => onTakeAttendance(selectedClassId)}
                      >
                        <Calendar className="h-4 w-4" />
                        Take Attendance
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </div>
              
              <div className="md:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <TabsList className="inline-flex h-10 bg-secondary/50">
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6 overflow-auto custom-scrollbar">
                    <TabsContent value="current" className="m-0 animate-fade-in">
                      <CurrentClassView selectedClassId={selectedClassId} />
                    </TabsContent>
                    
                    <TabsContent value="history" className="m-0 animate-fade-in">
                      <HistoryView selectedClassId={selectedClassId} />
                    </TabsContent>
                    
                    <TabsContent value="statistics" className="m-0 animate-fade-in">
                      <StatisticsView selectedClassId={selectedClassId} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTabs;
