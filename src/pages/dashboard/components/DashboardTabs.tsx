
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import ClassesList from './ClassesList';
import CurrentClassView from './CurrentClassView';
import HistoryView from './HistoryView';
import StatisticsView from './StatisticsView';

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
    <div className="space-y-6">
      <Tabs defaultValue="SE MME" onValueChange={handleGradeSelect} value={selectedGrade}>
        <TabsList className="mb-4">
          <TabsTrigger value="SE MME">SE MME</TabsTrigger>
          <TabsTrigger value="TE MME">TE MME</TabsTrigger>
          <TabsTrigger value="BE MME">BE MME</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="m-0">
                <CurrentClassView selectedClassId={selectedClassId} />
              </TabsContent>
              
              <TabsContent value="history" className="m-0">
                <HistoryView selectedClassId={selectedClassId} />
              </TabsContent>
              
              <TabsContent value="statistics" className="m-0">
                <StatisticsView selectedClassId={selectedClassId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
