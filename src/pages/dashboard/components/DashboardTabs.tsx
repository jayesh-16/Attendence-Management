
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassesList from './ClassesList';
import CurrentClassView from './CurrentClassView';
import StatisticsView from './StatisticsView';
import HistoryView from './HistoryView';
import { mockClasses } from "@/lib/mock-data";

interface DashboardTabsProps {
  selectedClassId: string;
  onClassSelect: (classId: string) => void;
  onTakeAttendance: (classId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  selectedClassId,
  onClassSelect,
  onTakeAttendance
}) => {
  return (
    <Tabs defaultValue="current-classes" className="space-y-4">
      <TabsList className="w-full max-w-md bg-muted/50">
        <TabsTrigger value="current-classes" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Current Classes</TabsTrigger>
        <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Statistics</TabsTrigger>
        <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="current-classes" className="space-y-6 mt-6">
        <ClassesList 
          classes={mockClasses} 
          selectedClassId={selectedClassId} 
          onClassSelect={onClassSelect} 
          onTakeAttendance={onTakeAttendance} 
        />
        
        {selectedClassId && (
          <CurrentClassView 
            selectedClassId={selectedClassId} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="statistics">
        <StatisticsView />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryView />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
