import { useState, useEffect } from 'react';
import { Calendar, Check } from 'lucide-react';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose?: () => void;
}

export function DateTimePicker({ value, onChange, onClose }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return value ? new Date(value) : new Date();
  });

  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const weekDays = ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'];

  // Generate time slots (every 15 minutes)
  const timeSlots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  const formatDisplay = (date: Date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}. ${month} ${year}, ${hours}:${minutes}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const handleTimeClick = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const updateValue = (date: Date) => {
    const formatted = date.toISOString().slice(0, 16);
    onChange(formatted);
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const currentDay = selectedDate.getDate();
  const currentTime = `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <span className="text-sm">{formatDisplay(selectedDate)}</span>
        <Calendar className="w-4 h-4 text-slate-400" />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          />
          <div className="absolute bottom-full mb-2 left-0 z-[101] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4 w-[420px]">
            {/* Month and Year selectors */}
            <div className="flex gap-2 mb-4">
              <select
                value={month}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(Number(e.target.value));
                  setSelectedDate(newDate);
                  updateValue(newDate);
                }}
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(Number(e.target.value));
                  setSelectedDate(newDate);
                  updateValue(newDate);
                }}
                className="w-24 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => year - 2 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              {/* Calendar */}
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && handleDateClick(day)}
                      disabled={!day}
                      className={`
                        h-8 rounded text-sm transition-colors
                        ${!day ? 'invisible' : ''}
                        ${
                          day === currentDay
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time picker */}
              <div className="w-20 border-l border-slate-200 dark:border-slate-700 pl-3">
                <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeClick(time)}
                      className={`
                        w-full px-2 py-1.5 text-sm text-left rounded transition-colors flex items-center justify-between
                        ${
                          time === currentTime
                            ? 'bg-slate-100 dark:bg-slate-700 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                        }
                      `}
                    >
                      {time}
                      {time === currentTime && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
