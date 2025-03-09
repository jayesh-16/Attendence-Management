
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
  // Filter classes by grade
  const seClasses = mockClasses.filter(cls => cls.grade === "SE MME");
  const teClasses = mockClasses.filter(cls => cls.grade === "TE MME");
  const beClasses = mockClasses.filter(cls => cls.grade === "BE MME");

  return (
    <Tabs defaultValue="current-classes" className="space-y-4">
      <TabsList className="w-full max-w-md bg-muted/50">
        <TabsTrigger value="current-classes" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Current Classes</TabsTrigger>
        <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Statistics</TabsTrigger>
        <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="current-classes" className="space-y-6 mt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">SE MME Classes</h2>
            {seClasses.length > 0 ? (
              <ClassesList 
                classes={seClasses} 
                selectedClassId={selectedClassId} 
                onClassSelect={onClassSelect} 
                onTakeAttendance={onTakeAttendance} 
              />
            ) : (
              <p className="text-muted-foreground">No SE MME classes found. Add subjects to see them here.</p>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">TE MME Classes</h2>
            {teClasses.length > 0 ? (
              <ClassesList 
                classes={teClasses} 
                selectedClassId={selectedClassId} 
                onClassSelect={onClassSelect} 
                onTakeAttendance={onTakeAttendance} 
              />
            ) : (
              <p className="text-muted-foreground">No TE MME classes found. Add subjects to see them here.</p>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">BE MME Classes</h2>
            {beClasses.length > 0 ? (
              <ClassesList 
                classes={beClasses} 
                selectedClassId={selectedClassId} 
                onClassSelect={onClassSelect} 
                onTakeAttendance={onTakeAttendance} 
              />
            ) : (
              <p className="text-muted-foreground">No BE MME classes found. Add subjects to see them here.</p>
            )}
          </div>
        </div>
        
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
