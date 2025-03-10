
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import ClassesList from './ClassesList';
import CurrentClassView from './CurrentClassView';
import StatisticsView from './StatisticsView';
import HistoryView from './HistoryView';
import { Class } from "@/types";
import SubjectDialog from './SubjectDialog';

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
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");

  const { data: classesData = [], refetch: refetchClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Map to include empty students array to match Class type
      return data.map(cls => ({
        ...cls,
        students: [] // Add empty students array to match Class type
      })) as Class[];
    },
  });

  // Handle successful subject addition
  const handleAddSubjectSuccess = () => {
    refetchClasses();
    setOpenAddSubject(false);
  };

  // Filter classes by grade
  const seClasses = classesData.filter(cls => cls.grade === "SE MME");
  const teClasses = classesData.filter(cls => cls.grade === "TE MME");
  const beClasses = classesData.filter(cls => cls.grade === "BE MME");

  const AddSubjectCard = ({ grade }: { grade: string }) => (
    <div 
      className="border rounded-lg p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer"
      onClick={() => {
        setSelectedGrade(grade);
        setOpenAddSubject(true);
      }}
    >
      <Button variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        Add Subject
      </Button>
      <p className="text-sm text-muted-foreground mt-2">Maximum 5 subjects per grade</p>
    </div>
  );

  return (
    <>
      <Tabs defaultValue="se-mme" className="space-y-4">
        <TabsList className="w-full max-w-md bg-muted/50">
          <TabsTrigger value="se-mme" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            SE MME
          </TabsTrigger>
          <TabsTrigger value="te-mme" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            TE MME
          </TabsTrigger>
          <TabsTrigger value="be-mme" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            BE MME
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="se-mme" className="space-y-6 mt-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">SE MME Subjects</h2>
              <div className="grid gap-4">
                {seClasses.length > 0 && (
                  <ClassesList 
                    classes={seClasses} 
                    selectedClassId={selectedClassId} 
                    onClassSelect={onClassSelect} 
                    onTakeAttendance={onTakeAttendance} 
                  />
                )}
                {seClasses.length < 5 && <AddSubjectCard grade="SE MME" />}
                {seClasses.length === 0 && (
                  <p className="text-muted-foreground">No SE MME subjects found. Add subjects to see them here.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="te-mme" className="space-y-6 mt-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">TE MME Subjects</h2>
              <div className="grid gap-4">
                {teClasses.length > 0 && (
                  <ClassesList 
                    classes={teClasses} 
                    selectedClassId={selectedClassId} 
                    onClassSelect={onClassSelect} 
                    onTakeAttendance={onTakeAttendance} 
                  />
                )}
                {teClasses.length < 5 && <AddSubjectCard grade="TE MME" />}
                {teClasses.length === 0 && (
                  <p className="text-muted-foreground">No TE MME subjects found. Add subjects to see them here.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="be-mme" className="space-y-6 mt-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">BE MME Subjects</h2>
              <div className="grid gap-4">
                {beClasses.length > 0 && (
                  <ClassesList 
                    classes={beClasses} 
                    selectedClassId={selectedClassId} 
                    onClassSelect={onClassSelect} 
                    onTakeAttendance={onTakeAttendance} 
                  />
                )}
                {beClasses.length < 5 && <AddSubjectCard grade="BE MME" />}
                {beClasses.length === 0 && (
                  <p className="text-muted-foreground">No BE MME subjects found. Add subjects to see them here.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsView />
        </TabsContent>

        <TabsContent value="history">
          <HistoryView />
        </TabsContent>
      </Tabs>

      <SubjectDialog 
        open={openAddSubject} 
        onOpenChange={setOpenAddSubject} 
        grade={selectedGrade}
        onSuccess={handleAddSubjectSuccess}
      />
    </>
  );
};

export default DashboardTabs;
