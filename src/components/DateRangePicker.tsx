
import * as React from "react";
import { format, isAfter, isBefore, isSameDay, isWithinInterval, addDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ dateRange, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(new Date());
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const handleSelect = (day: Date) => {
    if (!dateRange.from) {
      onChange({ from: day, to: undefined });
    } else if (!dateRange.to && isAfter(day, dateRange.from)) {
      onChange({ ...dateRange, to: day });
      setIsOpen(false);
    } else {
      onChange({ from: day, to: undefined });
    }
  };

  const handleReset = () => {
    onChange({ from: undefined, to: undefined });
  };

  const prevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: Date[] = [];
    
    // Add days from previous month to fill first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(new Date(year, month, -firstDayOfMonth + i + 1));
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to fill last week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const isInRange = (day: Date) => {
    if (!dateRange.from || !hoverDate) return false;
    
    if (!dateRange.to) {
      return isWithinInterval(day, {
        start: isBefore(dateRange.from, hoverDate) ? dateRange.from : hoverDate,
        end: isAfter(hoverDate, dateRange.from) ? hoverDate : dateRange.from
      });
    }
    
    return isWithinInterval(day, {
      start: dateRange.from,
      end: dateRange.to
    });
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const days = getDaysInMonth(month);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-12",
            !dateRange.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                {format(dateRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy")
            )
          ) : (
            "Selecione as datas"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 animate-scale-up"
        align="start"
      >
        <div className="p-3 space-y-4 w-[330px]">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-medium">
              {format(month, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const isCurrentMonth = day.getMonth() === month.getMonth();
                const isSelected = 
                  dateRange.from && isSameDay(day, dateRange.from) || 
                  dateRange.to && isSameDay(day, dateRange.to);
                const isRangeDay = isInRange(day) && !isSelected;
                const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());

                return (
                  <div
                    key={i}
                    className={cn(
                      "calendar-day text-sm",
                      !isCurrentMonth && "text-muted-foreground/50",
                      isSelected && "calendar-day-selected",
                      isRangeDay && "calendar-day-range",
                      isPast && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isPast && isCurrentMonth && handleSelect(day)}
                    onMouseEnter={() => setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              Limpar
            </Button>
            {dateRange.from && !dateRange.to && (
              <div className="text-xs text-muted-foreground">
                Selecione a data de saída
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
