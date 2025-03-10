
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const studentSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  studentId: z.string().min(1, "Roll number is required"),
});

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId?: string;
  grade: string;
  onSuccess?: () => void;
}

const StudentDialog: React.FC<StudentDialogProps> = ({ 
  open, 
  onOpenChange,
  classId,
  grade,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      studentId: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // First insert the student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.name,
          email: data.email || null,
          student_id: data.studentId,
          created_by: user.id,
        })
        .select('id')
        .single();

      if (studentError) throw studentError;

      // If a class ID is provided, associate the student with the class
      if (classId && studentData?.id) {
        const { error: enrollmentError } = await supabase
          .from('class_students')
          .insert({
            class_id: classId,
            student_id: studentData.id,
          });

        if (enrollmentError) throw enrollmentError;
      }

      toast({
        title: "Success",
        description: "Student has been added successfully.",
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student {grade ? `for ${grade}` : ''}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message?.toString()}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentId">Roll Number</Label>
            <Input id="studentId" {...register("studentId")} placeholder="e.g., 2021001" />
            {errors.studentId && (
              <p className="text-sm text-red-500">{errors.studentId.message?.toString()}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message?.toString()}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
