
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";

const HistoryView: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Mock events data - in a real app this would come from Supabase
  const events = [
    { id: 1, title: "Book Fair", date: new Date(2024, 8, 15), time: "09:00 - 15:00", description: "Browse and purchase books at our annual school Book Fair." },
    { id: 2, title: "Sports Day", date: new Date(2024, 8, 20), time: "14:00 - 17:30", description: "A fun-filled day of athletic events and team competitions." },
    { id: 3, title: "Art Exhibition", date: new Date(2024, 8, 25), time: "16:00 - 19:00", description: "Display your artwork for the school community to admire." },
  ];

  // Filter events for the selected date
  const selectedDateEvents = events.filter(
    (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Calendar & Events</CardTitle>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              month={currentMonth}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
              Events
              <Button variant="link" className="text-primary">View All</Button>
            </h3>
            <div className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {event.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No events scheduled for {format(date, 'MMMM d, yyyy')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
