import React, { useState } from "react";

type AvailabilityCalendarProps = {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
};

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ selectedDates, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get all days in current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => new Date(year, month, i + 1));
  };

  const days = getDaysInMonth(currentMonth);

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    if (selectedDates.includes(dateStr)) {
      onChange(selectedDates.filter(d => d !== dateStr));
    } else {
      onChange([...selectedDates, dateStr]);
    }
  };

  // Change month
  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="border rounded-lg p-4 bg-white max-w-md">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => changeMonth(-1)} className="px-2 py-1 text-gray-500">&lt;</button>
        <span className="font-semibold">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </span>
        <button onClick={() => changeMonth(1)} className="px-2 py-1 text-gray-500">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(days[0].getDay()).fill(null).map((_, i) => <div key={i}></div>)}
        {days.map(day => {
          const dateStr = formatDate(day);
          const isSelected = selectedDates.includes(dateStr);
          return (
            <button
              key={dateStr}
              type="button"
              className={`rounded-full w-8 h-8 flex items-center justify-center text-sm
                ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100'}
              `}
              onClick={() => handleDateClick(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Selected: {selectedDates.length > 0 ? selectedDates.join(", ") : "None"}
      </div>
    </div>
  );
};

export default AvailabilityCalendar; 