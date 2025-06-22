// RecentMedication.jsx
import React from 'react';
import '../style/recentMedication.css';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const RecentMedicationActivity = ({ recentData }) => {
  useAuth();
  return (
    <div className="activity-container">
      <h2>Recent Medication Activity</h2>
      {recentData?.length === 0 && <p>No logs available.</p>}
      {recentData?.map((item, i) => (
        <div key={i} className="activity-card">
          <div className="left-section">
            {item.taken ? (
              <div className="icon success"><FaCheckCircle /></div>
            ) : (
              <div className="icon error"><FaExclamationTriangle /></div>
            )}
            <div>
              <strong>{new Date(item.date).toLocaleDateString()}</strong>
              <p>{item.taken ? 'Taken' : 'Missed'}</p>
            </div>
          </div>
          <div className="right-section">
            <span className={`btn status-btn ${item.taken ? 'taken' : 'missed'}`}>
              {item.taken ? 'Completed' : 'Missed'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentMedicationActivity;



// import React, { useEffect, useState } from 'react';
// import axios from '../api/axiosInstance';
// import '../style/recentMedication.css';
// import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// const RecentMedicationActivity = ({ userId }) => {
//   const [activityData, setActivityData] = useState([]);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axios.get(`/medication-logs/${userId}`);
//         setActivityData(res.data);
//       } catch (err) {
//         console.error('Failed to fetch recent activity:', err);
//       }
//     };
//     fetchLogs();
//   }, [userId]);

//   return (
//     <div className="activity-container">
//       <h2>Recent Medication Activity</h2>
//       {activityData.map((item, i) => (
//         <div key={i} className="activity-card">
//           <div className="left-section">
//             {item.taken ? (
//               <div className="icon success"><FaCheckCircle /></div>
//             ) : (
//               <div className="icon error"><FaExclamationTriangle /></div>
//             )}
//             <div>
//               <strong>{new Date(item.date).toLocaleDateString()}</strong>
//               <p>{item.taken ? 'Taken' : 'Missed'}</p>
//             </div>
//           </div>
//           <div className="right-section">
//             <span className={`btn status-btn ${item.taken ? 'taken' : 'missed'}`}>
//               {item.taken ? 'Completed' : 'Missed'}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RecentMedicationActivity;
