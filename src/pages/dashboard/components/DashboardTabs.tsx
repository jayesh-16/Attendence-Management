
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

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  selectedClassId, 
  onClassSelect, 
  onTakeAttendance,
  onGradeSelect 
}) => {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedGrade, setSelectedGrade] = useState<string>("SE MME");
  
  // Filtering classes by grade
  const classesForGrade = mockClasses.filter(cls => cls.grade === selectedGrade);
  
  // Helper function for selecting grade
  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    if (onGradeSelect) {
      onGradeSelect(grade);
    }
    
    // If the selected class is not in this grade, select the first class of this grade
    const classInGrade = classesForGrade.find(cls => cls.id === selectedClassId);
    if (!classInGrade && classesForGrade.length > 0) {
      onClassSelect(classesForGrade[0].id);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <Card className="border-none overflow-hidden shadow-md bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Tabs defaultValue={selectedGrade} onValueChange={handleGradeSelect} className="flex flex-col h-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="SE MME" className="text-center">SE MME</TabsTrigger>
                    <TabsTrigger value="TE MME" className="text-center">TE MME</TabsTrigger>
                    <TabsTrigger value="BE MME" className="text-center">BE MME</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 overflow-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
                    <ClassesList 
                      classes={classesForGrade}
                      selectedClassId={selectedClassId}
                      onClassSelect={onClassSelect}
                      onTakeAttendance={onTakeAttendance}
                    />
                    
                    <div className="mt-4">
                      <Button 
                        variant="gradient" 
                        className="w-full gap-2"
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                  <TabsList className="inline-flex bg-white/50 backdrop-blur-sm p-1 rounded-lg w-auto">
                    <TabsTrigger value="current" className="rounded-md">Current</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-md">History</TabsTrigger>
                    <TabsTrigger value="statistics" className="rounded-md">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 overflow-auto custom-scrollbar">
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
