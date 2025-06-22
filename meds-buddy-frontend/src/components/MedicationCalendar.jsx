import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import '../style/calender.css';
import { useAuth } from '../hooks/useAuth';

const MedicationCalendar = ({ userId }) => {
  useAuth();
  const today = new Date();
  const [takenDates, setTakenDates] = useState([]);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/caretaker/medication-logs/${userId}`);
        const dates = res.data
          .filter(log => log.taken === 1)
          .map(log => log.date);
        setTakenDates(dates);
      } catch (err) {
        console.error('Calendar fetch failed:', err);
      }
    };
    if (userId) fetchLogs();
  }, [userId]);

  const formatDate = date => date.toISOString().split('T')[0];
  const isToday = date => date.toDateString() === new Date().toDateString();

  const changeMonth = dir => {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth > 11) newMonth = 0, newYear++;
    if (newMonth < 0) newMonth = 11, newYear--;
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const generateCalendar = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    return cells;
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-box">
        <h2>Medication Calendar Overview</h2>
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>{'<'}</button>
          <span>
            {new Date(viewYear, viewMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button onClick={() => changeMonth(1)}>{'>'}</button>
        </div>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="calendar-day-label">{d}</div>
          ))}
          {generateCalendar().map((date, i) => {
            if (!date) return <div key={i} className="calendar-cell empty" />;

            const ds = formatDate(date);
            const isT = isToday(date);
            const isTaken = takenDates.includes(ds);
            const isPast = date < today && !isT;

            let statusClass = '';
            if (isT && isTaken) statusClass = 'today-taken'; // both today & taken
            else if (isT) statusClass = 'today';
            else if (isTaken) statusClass = 'taken';
            else if (isPast) statusClass = 'missed';

            return (
              <div key={i} className={`calendar-cell ${statusClass}`}>
                {isT && <div className="top-dot" />} {/* blue circle on top */}
                {date.getDate()}
              </div>
            );
          })}
        </div>
        <div className="legend">
          <div><span className="dot green" /> Taken</div>
          <div><span className="dot red" /> Missed</div>
          <div><span className="dot blue" /> Today</div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCalendar;





// import React, { useEffect, useState } from 'react';
// import axios from '../api/axiosInstance';
// import '../style/calender.css'
// import { FaClock } from 'react-icons/fa';
// import RecentMedicationActivity from './RecentMedication';

// const MedicationCalendar = ({ userId }) => {
//   const today = new Date();
//   const [takenDates, setTakenDates] = useState([]);
//   const [viewMonth, setViewMonth] = useState(today.getMonth());
//   const [viewYear, setViewYear] = useState(today.getFullYear());

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axios.get(`/caretaker/medication-logs/${userId}`);
//         const dates = res.data
//           .filter(log => log.taken === 1)
//           .map(log => log.date);
//         setTakenDates(dates);
//         console.log(res.data)
//       } catch (err) {
//         console.error('Calendar fetch failed:', err);
//       }
//     };
//     if (userId) fetchLogs();
//   }, [userId]);

//   const formatDate = date => date.toISOString().split('T')[0];
//   const isToday = date =>
//     date.toDateString() === new Date().toDateString();

//   const changeMonth = dir => {
//     let newMonth = viewMonth + dir;
//     let newYear = viewYear;
//     if (newMonth > 11) newMonth = 0, newYear++;
//     if (newMonth < 0) newMonth = 11, newYear--;
//     setViewMonth(newMonth);
//     setViewYear(newYear);
//   };

//   const generateCalendar = () => {
//     const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//     const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
//     const cells = Array(firstDay).fill(null);
//     for (let d = 1; d <= daysInMonth; d++) {
//       cells.push(new Date(viewYear, viewMonth, d));
//     }
//     return cells;
//   };

//   return (
//     <div className="calendar-wrapper">
//       <div className="calendar-box">
//         <h2>Medication Calendar Overview</h2>
//         <div className="calendar-header">
//           <button onClick={() => changeMonth(-1)}>{'<'}</button>
//           <span>{
//             new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' })
//           }</span>
//           <button onClick={() => changeMonth(1)}>{'>'}</button>
//         </div>
//         <div className="calendar-grid">
//           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
//             <div key={d} className="calendar-day-label">{d}</div>
//           ))}
//           {(generateCalendar()).map((date, i) => {
//             if (!date) return <div key={i} />;
//             const ds = formatDate(date);
//             const isT = isToday(date);
//             const isTaken = takenDates.includes(ds);
//             const isPast = date < today && !isT;
//             const status = isT ? 'today' : isTaken ? 'taken' : isPast ? 'missed' : '';
//             return (
//               <div
//                 key={i}
//                 className={`calendar-cell ${status}`}
//               >
//                 {date.getDate()}
//               </div>
//             );
//           })}
//         </div>
//         <div className="legend">
//           <div><span className="dot green" /> Taken</div>
//           <div><span className="dot red" /> Missed</div>
//           <div><span className="dot blue" /> Today</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicationCalendar;
