
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  description: z.string().optional(),
  schedule: z.string().min(1, "Schedule is required"),
});

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: string;
  onSuccess?: () => void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  grade,
  onSuccess 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = async (data: z.infer<typeof subjectSchema>) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('classes')
        .insert({
          name: data.name,
          description: data.description || null,
          schedule: data.schedule,
          grade: grade,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject has been added successfully.",
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
          <DialogTitle>Add New Subject for {grade}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message?.toString()}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input id="schedule" {...register("schedule")} placeholder="e.g., Mon, Wed 10:00-11:30" />
            {errors.schedule && (
              <p className="text-sm text-red-500">{errors.schedule.message?.toString()}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Add Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectDialog;

