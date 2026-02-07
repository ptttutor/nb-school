"use client";

import * as React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({ date, setDate, placeholder = "เลือกวันที่และเวลา" }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date);
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? format(date, "HH:mm") : "09:00"
  );

  React.useEffect(() => {
    if (date) {
      setTempDate(date);
      setTimeValue(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setTempDate(undefined);
      return;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    newDate.setHours(hours, minutes, 0, 0);
    setTempDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (tempDate) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(tempDate);
      newDate.setHours(hours, minutes, 0, 0);
      setTempDate(newDate);
    }
  };

  const handleConfirm = () => {
    setDate(tempDate);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setTimeValue(date ? format(date, "HH:mm") : "09:00");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "d MMMM yyyy 'เวลา' HH:mm 'น.'", { locale: th })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Label htmlFor="time" className="text-sm font-medium mb-2 block">
            <Clock className="w-4 h-4 inline mr-1" />
            เวลา
          </Label>
          <Input
            id="time"
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="w-full"
          />
        </div>
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={th}
        />
        <div className="p-3 border-t flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            ตกลง
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
