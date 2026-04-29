import React, { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';

const MOCK_SCHEDULE = [
  { id: 1, day: 'Lunes', time: '6:00 AM', duration: '60m', type: 'FULL BODY', name: 'ENDURANCE', coach: 'Héctor Vega', spots: 3 },
  { id: 2, day: 'Lunes', time: '8:00 AM', duration: '60m', type: 'UPPER BODY', name: 'CALISTHENICS', coach: 'Héctor Vega', waitlist: true },
  { id: 3, day: 'Martes', time: '7:00 AM', duration: '60m', type: 'LOWER BODY', name: 'ENDURANCE', coach: 'Mau', spots: 1 },
  { id: 4, day: 'Martes', time: '6:00 PM', duration: '60m', type: 'ANIMAL FLOW', name: 'MOBILITY', coach: 'Rulo', spots: 6 },
  { id: 5, day: 'Miércoles', time: '6:00 AM', duration: '75m', type: 'CALISTHENICS', name: 'CALISTHENICS', coach: 'Héctor Vega', spots: 14 },
  { id: 6, day: 'Miércoles', time: '8:00 AM', duration: '60m', type: 'FULL BODY', name: 'ENDURANCE', coach: 'Alcala', spots: 2 },
  { id: 7, day: 'Jueves', time: '9:00 AM', duration: '60m', type: 'LOWER BODY', name: 'ENDURANCE', coach: 'Bruno', spots: 8 },
  { id: 8, day: 'Viernes', time: '10:00 AM', duration: '60m', type: 'UPPER BODY', name: 'ENDURANCE', coach: 'Oscar', spots: 11 },
];

export default function ScheduleCalendar({ onClose, onSelectClass }) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const [selectedDay, setSelectedDay] = useState('Lunes');

  const filteredClasses = MOCK_SCHEDULE.filter(c => c.day === selectedDay);

  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal-content day-picker-layout">
        <div className="schedule-header" style={{borderBottom: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
            <CalendarIcon size={28} color="var(--primary)" />
            <span className="month-title" style={{fontSize: '2rem'}}>Horarios de Clases</span>
          </div>
          <button className="close-btn-schedule" onClick={onClose}><X size={28}/></button>
        </div>

        {/* Day Picker */}
        <div className="day-picker-container">
          {days.map(day => (
            <button 
              key={day} 
              className={`day-picker-btn ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="day-name">{day.substring(0, 3).toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="classes-list-container">
           {filteredClasses.length > 0 ? (
             filteredClasses.map(cls => (
               <div key={cls.id} className="class-row-card" onClick={() => onSelectClass(cls)}>
                 <div className="class-row-time">
                   <span className="time-main">{cls.time}</span>
                   <span className="time-dur">{cls.duration}</span>
                 </div>
                 <div className="class-row-info">
                   <span className="class-type-badge">{cls.type}</span>
                   <span className="class-name">{cls.name}</span>
                   <span className="class-coach">con {cls.coach}</span>
                 </div>
                 <div className="class-row-action">
                   {cls.waitlist ? (
                     <button className="badge-waitlist">Lista de Espera</button>
                   ) : (
                     <button className="badge-spots">{cls.spots} Disp.</button>
                   )}
                 </div>
               </div>
             ))
           ) : (
             <div className="no-classes-msg">No hay clases programadas para este día.</div>
           )}
        </div>
      </div>
    </div>
  );
}
