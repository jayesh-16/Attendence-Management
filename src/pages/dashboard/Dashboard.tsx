
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Clock, UserPlus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockClasses } from "@/lib/mock-data";
import DashboardTabs from "./components/DashboardTabs";
import SubjectDialog from "./components/SubjectDialog";
import StudentDialog from "./components/StudentDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0]?.id || "");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("SE MME");
  const currentDate = new Date();
  
  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleSubjectAdded = () => {
    toast({
      title: "Success",
      description: "Subject added successfully. Refreshing data...",
    });
    // In a real app, you would refresh the class data here
  };

  const handleStudentAdded = () => {
    toast({
      title: "Success",
      description: "Student added successfully. Refreshing data...",
    });
    // In a real app, you would refresh the student data here
  };

  if (!user) {
    return null; // Or a loading state
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MME-AT-TRACKING</h1>
        
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>Today: {format(currentDate, 'M/d/yyyy')}</span>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => setIsAddingStudent(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => setIsAddingSubject(true)}
          >
            <BookOpen className="h-4 w-4" />
            Add Subject
          </Button>
          
          <Button variant="gradient" onClick={() => navigate('/attendance')} className="whitespace-nowrap">
            Take Attendance
          </Button>
        </div>
      </div>
      
      <DashboardTabs 
        selectedClassId={selectedClassId} 
        onClassSelect={handleClassSelect} 
        onTakeAttendance={handleTakeAttendance}
        onGradeSelect={setSelectedGrade}
      />

      {/* Dialogs */}
      <StudentDialog 
        open={isAddingStudent} 
        onOpenChange={setIsAddingStudent}
        grade={selectedGrade}
        onSuccess={handleStudentAdded}
      />
      
      <SubjectDialog 
        open={isAddingSubject} 
        onOpenChange={setIsAddingSubject}
        grade={selectedGrade}
        onSuccess={handleSubjectAdded}
      />
    </div>
  );
};

export default Dashboard;
