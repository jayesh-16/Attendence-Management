
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Clock, UserPlus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardTabs from "./components/DashboardTabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const currentDate = new Date();
  
  // New state for forms
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("");
  const [newSubjectSchedule, setNewSubjectSchedule] = useState("");
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleAddSubject = async () => {
    try {
      // Get the auth user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You need to be logged in to add a subject');
        return;
      }
      
      // Add the subject to the database
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: newSubjectName,
          description: newSubjectDescription,
          grade: newSubjectClass,
          schedule: newSubjectSchedule,
          created_by: user.id
        });
      
      if (error) {
        toast.error('Failed to add subject: ' + error.message);
        return;
      }
      
      toast.success('Subject added successfully!');
      
      // Reset form
      setNewSubjectName("");
      setNewSubjectDescription("");
      setNewSubjectClass("");
      setNewSubjectSchedule("");
      setIsAddSubjectOpen(false);
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>Today: {format(currentDate, 'MMM d, yyyy')}</span>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsAddSubjectOpen(true)}
          >
            <BookOpen className="h-4 w-4" />
            Add Subject
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => navigate('/attendance')} 
            className="whitespace-nowrap bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Take Attendance
          </Button>
        </div>
      </div>
      
      <DashboardTabs 
        selectedClassId={selectedClassId} 
        onClassSelect={handleClassSelect} 
        onTakeAttendance={handleTakeAttendance}
      />
      
      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input 
                id="subjectName" 
                value={newSubjectName} 
                onChange={(e) => setNewSubjectName(e.target.value)} 
                placeholder="Enter subject name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newSubjectDescription} 
                onChange={(e) => setNewSubjectDescription(e.target.value)} 
                placeholder="Enter subject description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input 
                id="schedule" 
                value={newSubjectSchedule} 
                onChange={(e) => setNewSubjectSchedule(e.target.value)} 
                placeholder="E.g., Mon, Wed, Fri 10:00-11:30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectClass">Class</Label>
              <Select value={newSubjectClass} onValueChange={setNewSubjectClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SE MME">SE MME</SelectItem>
                  <SelectItem value="TE MME">TE MME</SelectItem>
                  <SelectItem value="BE MME">BE MME</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="default"
              onClick={handleAddSubject}
              disabled={!newSubjectName || !newSubjectClass || !newSubjectSchedule}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
