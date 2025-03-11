
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryViewProps {
  selectedClassId: string;
}

const HistoryView: React.FC<HistoryViewProps> = ({ selectedClassId }) => {
  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle>Attendance History for Class {selectedClassId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">View past attendance records here.</p>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
