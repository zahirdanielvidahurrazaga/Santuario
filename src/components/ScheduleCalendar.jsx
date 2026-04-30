import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronRight, Check, Crown, Dumbbell, Users, Baby, Zap, Lock, Plus, Minus } from 'lucide-react';

// ==========================================
// PLAN DEFINITIONS WITH SCHEDULE RULES
// ==========================================
const PLAN_CONFIG = {
  'Full Access Elite': {
    price: '$4,000 MXN', icon: Crown, color: '#c22e28',
    allowedDays: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    includes: ['Clases Grupales','Open Gym','Amenidades'],
    maxDaysPerWeek: 6, description: 'Acceso total: clases + zona de máquinas + amenidades',
  },
  'Clases Elite': {
    price: '$3,800 MXN', icon: Users, color: '#a3e635',
    allowedDays: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    includes: ['Clases Grupales','Amenidades'], excludes: ['Open Gym'],
    maxDaysPerWeek: 6, description: 'Solo clases grupales + amenidades',
  },
  'Plan Personalizado Elite': {
    price: '$16,000 MXN', icon: Zap, color: '#f59e0b',
    allowedDays: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    includes: ['Sesiones 1-on-1','Open Gym','Clases','Amenidades'],
    maxDaysPerWeek: 6, description: 'Entrenamiento personal ilimitado con coach',
  },
  'Plan Personalizado Lite': {
    price: '$10,000 MXN', icon: Dumbbell, color: '#3b82f6',
    allowedDays: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    includes: ['12 sesiones/mes','Open Gym','Amenidades'],
    maxDaysPerWeek: 3, selectDays: true, description: '3 sesiones por semana de 1:30 hr',
  },
  'Kids Elite': {
    price: '$2,500 MXN', icon: Baby, color: '#ec4899',
    allowedDays: ['Lunes','Martes','Miércoles','Jueves'],
    includes: ['Clases Kids','Amenidades básicas'],
    maxDaysPerWeek: 4, description: 'De 6 a 12 años · Lun a Jue 17:00-18:30',
  },
};

// ==========================================
// CLASS SCHEDULE DATA (90-min blocks)
// ==========================================
const SCHEDULE = {
  Lunes: [
    { id:'l1', time:'6:00', end:'7:30', type:'CALISTHENICS', name:'PULL', coach:'Héctor Vega', spots:12, period:'AM' },
    { id:'l2', time:'7:30', end:'9:00', type:'FULL BODY', name:'ENDURANCE', coach:'Alcala', spots:3, period:'AM' },
    { id:'l3', time:'9:00', end:'10:30', type:'MOBILITY', name:'RECOVERY', coach:'Rulo', spots:8, period:'AM' },
    { id:'l4', time:'16:30', end:'18:00', type:'CALISTHENICS', name:'PULL', coach:'Oscar', spots:5, period:'PM' },
    { id:'l5', time:'18:00', end:'19:30', type:'FULL BODY', name:'ENDURANCE', coach:'Bruno', spots:2, period:'PM' },
  ],
  Martes: [
    { id:'m1', time:'6:00', end:'7:30', type:'LOWER BODY', name:'PIERNA', coach:'Mau', spots:10, period:'AM' },
    { id:'m2', time:'7:30', end:'9:00', type:'ANIMAL FLOW', name:'MOBILITY', coach:'Rulo', spots:14, period:'AM' },
    { id:'m3', time:'9:00', end:'10:30', type:'CALISTHENICS', name:'SKILLS', coach:'Héctor Vega', spots:6, period:'AM' },
    { id:'m4', time:'16:30', end:'18:00', type:'LOWER BODY', name:'PIERNA', coach:'Alcala', spots:7, period:'PM' },
    { id:'m5', time:'18:00', end:'19:30', type:'FULL BODY', name:'ENDURANCE', coach:'Bruno', spots:4, period:'PM' },
  ],
  Miércoles: [
    { id:'w1', time:'6:00', end:'7:30', type:'UPPER BODY', name:'PUSH', coach:'Héctor Vega', spots:11, period:'AM' },
    { id:'w2', time:'7:30', end:'9:00', type:'FULL BODY', name:'ENDURANCE', coach:'Oscar', spots:5, period:'AM' },
    { id:'w3', time:'9:00', end:'10:30', type:'MOBILITY', name:'STRETCHING', coach:'Rulo', spots:15, period:'AM' },
    { id:'w4', time:'16:30', end:'18:00', type:'UPPER BODY', name:'PUSH', coach:'Mau', spots:9, period:'PM' },
    { id:'w5', time:'18:00', end:'19:30', type:'CALISTHENICS', name:'SKILLS', coach:'Héctor Vega', spots:1, period:'PM' },
  ],
  Jueves: [
    { id:'j1', time:'6:00', end:'7:30', type:'LOWER BODY', name:'PIERNA', coach:'Alcala', spots:13, period:'AM' },
    { id:'j2', time:'7:30', end:'9:00', type:'FULL BODY', name:'ENDURANCE', coach:'Bruno', spots:8, period:'AM' },
    { id:'j3', time:'9:00', end:'10:30', type:'ANIMAL FLOW', name:'MOBILITY', coach:'Rulo', spots:10, period:'AM' },
    { id:'j4', time:'16:30', end:'18:00', type:'LOWER BODY', name:'PIERNA', coach:'Oscar', spots:6, period:'PM' },
    { id:'j5', time:'18:00', end:'19:30', type:'FULL BODY', name:'ENDURANCE', coach:'Mau', spots:3, period:'PM' },
  ],
  Viernes: [
    { id:'v1', time:'6:00', end:'7:30', type:'CALISTHENICS', name:'PULL/PUSH', coach:'Héctor Vega', spots:9, period:'AM' },
    { id:'v2', time:'7:30', end:'9:00', type:'FULL BODY', name:'ENDURANCE', coach:'Alcala', spots:7, period:'AM' },
    { id:'v3', time:'9:00', end:'10:30', type:'MOBILITY', name:'RECOVERY', coach:'Rulo', spots:12, period:'AM' },
  ],
  Sábado: [
    { id:'s1', time:'8:00', end:'9:30', type:'GRUPAL', name:'OPEN CLASS', coach:'Equipo Elite', spots:20, period:'AM' },
    { id:'s2', time:'9:30', end:'11:00', type:'ELDER', name:'ADULTO MAYOR', coach:'Rulo', spots:10, period:'AM' },
  ],
};

const KIDS_SCHEDULE = {
  Lunes:    [{ id:'k1', time:'17:00', end:'18:30', type:'KIDS', name:'CALISTENIA KIDS', coach:'Equipo Elite', spots:8, period:'PM' }],
  Martes:   [{ id:'k2', time:'17:00', end:'18:30', type:'KIDS', name:'MOVEMENT KIDS', coach:'Equipo Elite', spots:8, period:'PM' }],
  Miércoles:[{ id:'k3', time:'17:00', end:'18:30', type:'KIDS', name:'CALISTENIA KIDS', coach:'Equipo Elite', spots:8, period:'PM' }],
  Jueves:   [{ id:'k4', time:'17:00', end:'18:30', type:'KIDS', name:'MOVEMENT KIDS', coach:'Equipo Elite', spots:8, period:'PM' }],
};

const dayAbbrev = { Lunes:'LUN', Martes:'MAR', Miércoles:'MIÉ', Jueves:'JUE', Viernes:'VIE', Sábado:'SÁB', Domingo:'DOM' };
const ALL_DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export default function ScheduleCalendar({ onClose, onSelectClass }) {
  const [step, setStep] = useState(1); // 1=calendar, 2=plans
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [selectedClasses, setSelectedClasses] = useState([]); // [{day, ...classObj}]
  const [isKidsMode, setIsKidsMode] = useState(false);

  const getSchedule = () => isKidsMode ? KIDS_SCHEDULE : SCHEDULE;
  const getClassesForDay = (day) => getSchedule()[day] || [];

  // Toggle class selection
  const toggleClass = (day, cls) => {
    const key = `${day}-${cls.id}`;
    const exists = selectedClasses.find(c => `${c.day}-${c.id}` === key);
    if (exists) {
      setSelectedClasses(prev => prev.filter(c => `${c.day}-${c.id}` !== key));
    } else {
      setSelectedClasses(prev => [...prev, { ...cls, day }]);
    }
  };

  const isClassSelected = (day, cls) => {
    return selectedClasses.some(c => c.day === day && c.id === cls.id);
  };

  // Get count of unique days in selection
  const selectedDaysCount = [...new Set(selectedClasses.map(c => c.day))].length;

  // Filter plans compatible with selection
  const getCompatiblePlans = () => {
    const selectedDayNames = [...new Set(selectedClasses.map(c => c.day))];
    return Object.entries(PLAN_CONFIG).filter(([key, config]) => {
      if (isKidsMode && key !== 'Kids Elite') return false;
      if (!isKidsMode && key === 'Kids Elite') return false;
      // Check all selected days are allowed by the plan
      const allDaysAllowed = selectedDayNames.every(d => config.allowedDays.includes(d));
      const withinLimit = selectedDaysCount <= config.maxDaysPerWeek;
      return allDaysAllowed && withinLimit;
    });
  };

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div className="schedule-modal-content" onClick={e => e.stopPropagation()}>

        {/* =================== STEP 1: CALENDAR =================== */}
        {step === 1 && (
          <>
            {/* Header */}
            <div className="schedule-header">
              <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
                <CalendarIcon size={22} color="var(--primary)" />
                <span className="month-title" style={{fontSize:'clamp(1.1rem, 3.5vw, 1.6rem)'}}>Horarios</span>
              </div>
              <button className="close-btn-schedule" onClick={onClose}><X size={20}/></button>
            </div>

            {/* Kids toggle */}
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'1rem'}}>
              <button
                onClick={() => { setIsKidsMode(false); setSelectedClasses([]); setSelectedDay('Lunes'); }}
                style={{
                  padding:'0.4rem 1rem', borderRadius:'50px', border:'none', cursor:'pointer',
                  fontFamily:'Montserrat', fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.05em',
                  background: !isKidsMode ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: !isKidsMode ? 'white' : 'var(--text-muted)', transition:'all 0.3s'
                }}
              >Adultos</button>
              <button
                onClick={() => { setIsKidsMode(true); setSelectedClasses([]); setSelectedDay('Lunes'); }}
                style={{
                  padding:'0.4rem 1rem', borderRadius:'50px', border:'none', cursor:'pointer',
                  fontFamily:'Montserrat', fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.05em',
                  background: isKidsMode ? '#ec4899' : 'rgba(255,255,255,0.05)',
                  color: isKidsMode ? 'white' : 'var(--text-muted)', transition:'all 0.3s'
                }}
              >Kids (6-12)</button>
            </div>

            {/* Day Picker */}
            <div className="day-picker-container">
              {ALL_DAYS.map(day => {
                const hasClasses = getClassesForDay(day).length > 0;
                const hasSelected = selectedClasses.some(c => c.day === day);
                return (
                  <button
                    key={day}
                    className={`day-picker-btn ${selectedDay === day ? 'active' : ''} ${!hasClasses ? 'disabled' : ''}`}
                    onClick={() => hasClasses && setSelectedDay(day)}
                    disabled={!hasClasses}
                  >
                    <span className="day-name">{dayAbbrev[day]}</span>
                    {hasSelected && <span className="day-check-indicator"><Check size={10} /></span>}
                  </button>
                );
              })}
            </div>

            {/* Classes */}
            <div className="classes-list-container">
              {getClassesForDay(selectedDay).map((cls) => {
                const selected = isClassSelected(selectedDay, cls);
                return (
                  <div
                    key={cls.id}
                    className={`class-row-card ${selected ? 'class-selected' : ''}`}
                    onClick={() => toggleClass(selectedDay, cls)}
                  >
                    <div className="class-row-left">
                      <div className="class-select-indicator" style={{background: selected ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}}>
                        {selected ? <Check size={14} color="white" /> : <Plus size={14} color="var(--text-muted)" />}
                      </div>
                      <div className="class-row-time-block">
                        <span className="time-main">{cls.time}</span>
                        <span className="time-dur">{cls.end}</span>
                      </div>
                      <div className="class-row-info">
                        <span className="class-type-badge">{cls.type}</span>
                        <span className="class-name">{cls.name}</span>
                        <span className="class-coach">con {cls.coach}</span>
                      </div>
                    </div>
                    <div className="class-row-action">
                      {cls.spots <= 3 ? (
                        <span className="badge-spots badge-urgent">{cls.spots} Disp.</span>
                      ) : (
                        <span className="badge-spots">{cls.spots} Disp.</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {getClassesForDay(selectedDay).length === 0 && (
                <div className="no-classes-msg">No hay clases este día.</div>
              )}
            </div>

            {/* Selection Summary Bar */}
            {selectedClasses.length > 0 && (
              <div className="schedule-selection-bar">
                <div className="selection-bar-info">
                  <span className="selection-bar-count">{selectedClasses.length}</span>
                  <span className="selection-bar-text">
                    {selectedClasses.length === 1 ? 'clase seleccionada' : 'clases seleccionadas'} · {selectedDaysCount} {selectedDaysCount === 1 ? 'día' : 'días'}
                  </span>
                </div>
                <button className="btn-luxury selection-bar-btn" onClick={() => setStep(2)}>
                  Elegir Plan <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* =================== STEP 2: PLAN SELECTION =================== */}
        {step === 2 && (
          <>
            <div className="schedule-header">
              <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
                <button
                  onClick={() => setStep(1)}
                  style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-muted)', cursor:'pointer', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s'}}
                >←</button>
                <span className="month-title" style={{fontSize:'clamp(1rem, 3vw, 1.4rem)'}}>Elige tu plan</span>
              </div>
              <button className="close-btn-schedule" onClick={onClose}><X size={20}/></button>
            </div>

            {/* Mini summary of selections */}
            <div className="schedule-mini-summary">
              <p className="summary-title">Tu selección</p>
              <div className="summary-chips">
                {selectedClasses.map((cls, i) => (
                  <span key={i} className="summary-chip">
                    {dayAbbrev[cls.day]} {cls.time} · {cls.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Plan cards */}
            <div className="plan-selector-list">
              {getCompatiblePlans().map(([key, config]) => {
                const IconComp = config.icon;
                return (
                  <button
                    key={key}
                    className="plan-selector-card"
                    onClick={() => {
                      onSelectClass({
                        planKey: key,
                        planConfig: config,
                        selectedClasses: selectedClasses,
                      });
                    }}
                  >
                    <div className="plan-selector-icon" style={{background:`${config.color}15`, color:config.color}}>
                      <IconComp size={20} />
                    </div>
                    <div className="plan-selector-info">
                      <span className="plan-selector-name">{key}</span>
                      <span className="plan-selector-detail">{config.description}</span>
                    </div>
                    <div className="plan-selector-right">
                      <span className="plan-selector-price">{config.price}</span>
                      <ChevronRight size={16} style={{color:'var(--text-muted)'}} />
                    </div>
                  </button>
                );
              })}
            </div>

            {getCompatiblePlans().length === 0 && (
              <div className="no-classes-msg" style={{paddingTop:'1rem'}}>
                No hay planes compatibles con tu selección de {selectedDaysCount} días.
                <br/><button onClick={() => setStep(1)} style={{color:'var(--primary)', background:'transparent', border:'none', cursor:'pointer', marginTop:'0.5rem', fontFamily:'Montserrat', textDecoration:'underline'}}>Ajustar selección</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
