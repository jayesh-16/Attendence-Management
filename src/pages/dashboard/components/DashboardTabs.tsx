
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
import { toast } from "sonner";

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

  const { data: classesData = [], isLoading: isLoadingClasses, refetch: refetchClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:class_students(
            student:students(*)
          )
        `);
      
      if (error) {
        toast.error('Failed to load classes: ' + error.message);
        throw error;
      }
      
      // Transform the data to match our Class type
      return data.map(cls => ({
        ...cls,
        students: cls.students?.map(s => ({
          id: s.student.id,
          name: s.student.name,
          email: s.student.email,
          studentId: s.student.student_id, // Map student_id to studentId
          avatarUrl: s.student.avatar_url
        })) || []
      })) as Class[];
    },
  });

  // Handle successful subject addition
  const handleAddSubjectSuccess = () => {
    refetchClasses();
    setOpenAddSubject(false);
    toast.success('Subject added successfully!');
  };

  // Filter classes by grade
  const seClasses = classesData.filter(cls => cls.grade === "SE MME");
  const teClasses = classesData.filter(cls => cls.grade === "TE MME");
  const beClasses = classesData.filter(cls => cls.grade === "BE MME");

  const AddSubjectCard = ({ grade }: { grade: string }) => (
    <div 
      className="border rounded-lg p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer shadow-sm hover:shadow-md"
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
      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList className="w-full bg-muted/30 p-1">
          <TabsTrigger 
            value="statistics" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Statistics
          </TabsTrigger>
          <TabsTrigger 
            value="se-mme" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            SE MME
          </TabsTrigger>
          <TabsTrigger 
            value="te-mme" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            TE MME
          </TabsTrigger>
          <TabsTrigger 
            value="be-mme" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            BE MME
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statistics">
          <StatisticsView />
        </TabsContent>

        <TabsContent value="se-mme" className="space-y-6 mt-6 animate-fade-in">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">SE MME Subjects</h2>
              <div className="grid gap-4">
                {isLoadingClasses ? (
                  <div className="text-center py-8">Loading subjects...</div>
                ) : (
                  <>
                    {seClasses.length > 0 && (
                      <ClassesList 
                        classes={seClasses} 
                        selectedClassId={selectedClassId} 
                        onClassSelect={onClassSelect} 
                        onTakeAttendance={onTakeAttendance} 
                      />
                    )}
                    {seClasses.length < 5 && <AddSubjectCard grade="SE MME" />}
                    {seClasses.length === 0 && !isLoadingClasses && (
                      <p className="text-muted-foreground">No SE MME subjects found. Add subjects to see them here.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="te-mme" className="space-y-6 mt-6 animate-fade-in">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">TE MME Subjects</h2>
              <div className="grid gap-4">
                {isLoadingClasses ? (
                  <div className="text-center py-8">Loading subjects...</div>
                ) : (
                  <>
                    {teClasses.length > 0 && (
                      <ClassesList 
                        classes={teClasses} 
                        selectedClassId={selectedClassId} 
                        onClassSelect={onClassSelect} 
                        onTakeAttendance={onTakeAttendance} 
                      />
                    )}
                    {teClasses.length < 5 && <AddSubjectCard grade="TE MME" />}
                    {teClasses.length === 0 && !isLoadingClasses && (
                      <p className="text-muted-foreground">No TE MME subjects found. Add subjects to see them here.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="be-mme" className="space-y-6 mt-6 animate-fade-in">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">BE MME Subjects</h2>
              <div className="grid gap-4">
                {isLoadingClasses ? (
                  <div className="text-center py-8">Loading subjects...</div>
                ) : (
                  <>
                    {beClasses.length > 0 && (
                      <ClassesList 
                        classes={beClasses} 
                        selectedClassId={selectedClassId} 
                        onClassSelect={onClassSelect} 
                        onTakeAttendance={onTakeAttendance} 
                      />
                    )}
                    {beClasses.length < 5 && <AddSubjectCard grade="BE MME" />}
                    {beClasses.length === 0 && !isLoadingClasses && (
                      <p className="text-muted-foreground">No BE MME subjects found. Add subjects to see them here.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
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
