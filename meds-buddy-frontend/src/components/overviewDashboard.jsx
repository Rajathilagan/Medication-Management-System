import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
import '../style/overview.css';
import MedicationForm from './MedicationForm';

const Overview = ({ userId }) => {
  const [adherence, setAdherence] = useState({ taken: 0, missed: 0, remaining: 0 });

  const now = new Date(); 
  const year = now.getFullYear(); 
  const month = now.getMonth();
  const today = now.getDate();  
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const remaining = totalDaysInMonth - today
  
  useEffect(() => {
    const fetchAdherence = async () => {
      try {
        const res = await axios.get(`/dashboard/adherence/${userId}`);
        setAdherence(res.data);
        console.log(res.data)
      } catch (err) {
        console.error(`Failed to fetch adherence:${err.message}`);
      }
    };
    fetchAdherence();
  }, [userId]);

  const totalDays = adherence.taken + adherence.missed + adherence.remaining;
  const progress = totalDays ? Math.round((adherence.taken / totalDays) * 100) : 0;

  return (
    <div className="overview-grid">
      <MedicationForm userId={userId} />
      {/* ... status & quick actions as before ... */}
      <div className="progress-card">
        <h3>Monthly Adherence Progress</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-summary">
          <span className="green">{adherence.taken} Taken</span>
          <span className="red">{adherence.missed} Missed</span>
          <span className="blue">{remaining} Remaining</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;








// import React, { useEffect, useState } from 'react';
// import axios from '../api/axiosInstance';
// import { FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
// import '../style/overview.css';

// const Overview = ({ userId }) => {
//   const [adherence, setAdherence] = useState({ taken: 0, missed: 0, remaining: 0 });

//   useEffect(() => {
//     const fetchAdherence = async () => {
//       try {
//         const res = await axios.get(`/adherence/${userId}`);
//         setAdherence(res.data);
//       } catch (err) {
//         console.error('Failed to fetch adherence:', err);
//       }
//     };

//     fetchAdherence();
//   }, [userId]);

//   const totalDays = adherence.taken + adherence.missed + adherence.remaining;
//   const progress = Math.round((adherence.taken / totalDays) * 100);

//   return (
//     <div className="overview-grid">
//       <div className="status-card">
//         <h3><FaCalendarAlt /> Today's Status</h3>
//         <div className="status-box">
//           <strong>Daily Medication Set</strong>
//           <p>8:00 AM</p>
//           <span className="pill-status">Pending</span>
//         </div>
//       </div>

//       <div className="quick-actions-card">
//         <h3>Quick Actions</h3>
//         <button><FaEnvelope /> Send Reminder Email</button>
//         <button><FaBell /> Configure Notifications</button>
//         <button><FaCalendarAlt /> View Full Calendar</button>
//       </div>

//       <div className="progress-card">
//         <h3>Monthly Adherence Progress</h3>
//         <p>Overall Progress</p>
//         <div className="progress-bar">
//           <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//         </div>
//         <div className="progress-summary">
//           <span className="green">{adherence.taken} days<br />Taken</span>
//           <span className="red">{adherence.missed} days<br />Missed</span>
//           <span className="blue">{adherence.remaining} days<br />Remaining</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;
