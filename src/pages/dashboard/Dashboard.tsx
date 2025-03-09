
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Clock, UserPlus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockClasses } from "@/lib/mock-data";
import DashboardTabs from "./components/DashboardTabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0]?.id || "");
  const currentDate = new Date();
  
  // New state for forms
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("");
  
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("");
  const [newSubjectSchedule, setNewSubjectSchedule] = useState("");
  
  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/${classId}/${format(currentDate, 'yyyy-MM-dd')}`);
  };
  
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleAddStudent = () => {
    // In a real app, this would call an API to add the student
    console.log("Adding student:", {
      name: newStudentName,
      email: newStudentEmail,
      studentId: newStudentId,
      classId: newSubjectClass
    });
    
    // Reset form
    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentId("");
    setNewStudentClass("");
  };

  const handleAddSubject = () => {
    // In a real app, this would call an API to add the subject
    console.log("Adding subject:", {
      name: newSubjectName,
      description: newSubjectDescription,
      grade: newSubjectClass,
      schedule: newSubjectSchedule
    });
    
    // Reset form
    setNewSubjectName("");
    setNewSubjectDescription("");
    setNewSubjectClass("");
    setNewSubjectSchedule("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MME-AT-TRACKING</h1>
        
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>Today: {format(currentDate, 'M/d/yyyy')}</span>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input 
                    id="name" 
                    value={newStudentName} 
                    onChange={(e) => setNewStudentName(e.target.value)} 
                    placeholder="Enter student name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newStudentEmail} 
                    onChange={(e) => setNewStudentEmail(e.target.value)} 
                    placeholder="Enter student email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input 
                    id="studentId" 
                    value={newStudentId} 
                    onChange={(e) => setNewStudentId(e.target.value)} 
                    placeholder="Enter student ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={newStudentClass} onValueChange={setNewStudentClass}>
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
                  variant="gradient" 
                  onClick={handleAddStudent}
                  disabled={!newStudentName || !newStudentEmail || !newStudentId || !newStudentClass}
                >
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
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
                  variant="gradient" 
                  onClick={handleAddSubject}
                  disabled={!newSubjectName || !newSubjectClass || !newSubjectSchedule}
                >
                  Add Subject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="gradient" onClick={() => navigate('/attendance')} className="whitespace-nowrap">
            Take Attendance
          </Button>
        </div>
      </div>
      
      <DashboardTabs 
        selectedClassId={selectedClassId} 
        onClassSelect={handleClassSelect} 
        onTakeAttendance={handleTakeAttendance}
      />
    </div>
  );
};

export default Dashboard;
