import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import RecentMedicationActivity from '../components/RecentMedication.jsx';
import MedicationCalendar from '../components/MedicationCalendar.jsx';
import Overview from '../components/overviewDashboard.jsx';
import '../style/caretaker.css';
import axios from '../api/axiosInstance';
import Caretaker from '../components/Caretaker.jsx';
import NotificationPage from '../components/NotificationPage.jsx';

const CaretakerDashboard = () => {
  const { user } = useAuth(); 
  const caretakerId = user?.id;

  const [patientId, setPatient] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [recentData, setRecentData] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');

  const buttonList = [
    { id: 1, name: 'Overview' },
    { id: 2, name: 'Recent Activity' },
    { id: 3, name: 'Calendar View' },
    { id: 4, name: 'Notifications' }
  ];

  useEffect(() => {
    const fetchAssignedPatient = async () => {
      try {
        const res = await axios.get(`/caretaker/medication-logs-with-caretaker/${caretakerId}`);
        const rawData = res.data;

        if (rawData.length > 0) {
          // Convert snake_case to camelCase
          const formattedData = rawData.map(item => ({
            caretakerId: item.caretaker_id,
            patientId: item.patient_id,
            name: item.name,
            medicationId: item.medication_id,
            medicationName: item.medication_name,
            logId: item.log_id,
            date: item.date,
            taken: item.taken
          }));

          setPatient(
            formattedData[0].patientId);
          setPatientName(formattedData[0].name);

          setRecentData(formattedData);
        }
      } catch (err) {
        console.error('Error fetching assigned patient:', err);
      }
    };

    if (caretakerId) fetchAssignedPatient();
  }, [caretakerId]);

  return (
    <>
      <Navbar />
      <div className="caretaker-container">
        <div className="caretaker-dashboard-container">
          <div className='caretaker-dashboard-card'>
            <img width="24" height="24" src="https://img.icons8.com/material-two-tone/24/businessman.png" className="icon" alt="businessman" />
            <div>
              <h1 className="caretaker-heading">Caretaker Dashboard</h1>
              <p className="caretaker-para">
                Monitoring {patientName ? patientName : "Loading..."}'s medication adherence
              </p>
            </div>
          </div>
          <Caretaker userId = {patientId} />
          {/* <div className="percentage-container">
            <div className="percentage-card">
              <h2 className="caretaker-head">85%</h2>
              <p className="caretaker-para">Adherence Percentage</p>
            </div>
            <div className="percentage-card">
              <h2 className="caretaker-head">5</h2>
              <p className="caretaker-para">Current Streak</p>
            </div>
            <div className="percentage-card">
              <h2 className="caretaker-head">3</h2>
              <p className="caretaker-para">Missed This Month</p>
            </div>
            <div className="percentage-card">
              <h2 className="caretaker-head">4</h2>
              <p className="caretaker-para">Taken This Week</p>
            </div>
          </div> */}
        </div>

        <div className="button-container">
          {buttonList.map((btn) => (
            <button
              key={btn.id}
              className={activeTab === btn.name ? 'active-cls-btn' : 'button-cls'}
              onClick={() => setActiveTab(btn.name)}
            >
              {btn.name}
            </button>
          ))}
        </div>

        {patientId && (
          <>
            {activeTab === 'Overview' && <Overview userId={patientId} />}
          {activeTab === 'Recent Activity' && <RecentMedicationActivity userId={patientId} recentData = {recentData} />}
            {activeTab === 'Calendar View' && <MedicationCalendar userId={patientId} />}
            {activeTab === 'Notifications' && <NotificationPage />}
          </>
        )}
      </div>
    </>
  );
};

export default CaretakerDashboard;





// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import Navbar from '../components/Navbar';
// import RecentMedicationActivity from '../components/RecentMedication.jsx';
// import MedicationCalendar from '../components/MedicationCalendar.jsx';
// import Overview from '../components/overviewDashboard.jsx';
// import '../style/caretaker.css';
// import axios from '../api/axiosInstance';

// const CaretakerDashboard = () => {
//   const { user } = useAuth(); // JWT-protected user
//   const caretakerId = user?.id;

//   const [patient, setPatient] = useState(null);
//   const [medications, setMedications] = useState([]);

//   useEffect(() => {
//     const fetchPatientMeds = async () => {
//       try {
//         const res = await axios.get(`/caretaker/${caretakerId}/medications`);
//         setMedications(res.data);
//         if (res.data.length > 0) {
//           setPatient({
//             id: res.data[0].user_id, // patient ID
//             name: res.data[0].patient_name,
//           });
//         }
//       } catch (err) {
//         console.error('Failed to fetch patient medications:', err);
//       }
//     };

//     if (caretakerId) {
//       fetchPatientMeds();
//     }
//   }, [caretakerId]);

//   const onHandleChange = () => {
//     console.log("View change clicked");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="caretaker-container">
//         <div className="caretaker-dashboard-container">
//           <div className="caretaker-dashboard-card">
//             <img
//               width="24"
//               height="24"
//               src="https://img.icons8.com/material-two-tone/24/businessman.png"
//               className="icon"
//               alt="businessman"
//             />
//             <div>
//               <h1 className="caretaker-heading">Caretaker Dashboard</h1>
//               <p className="caretaker-para">
//                 {patient
//                   ? `Monitoring ${patient.name}'s medication adherence`
//                   : 'Loading patient info...'}
//               </p>
//             </div>
//           </div>

//           <div className="percentage-container">
//             <div className="percentage-card">
//               <h2 className="caretaker-head">85%</h2>
//               <p className="caretaker-para">Adherence Percentage</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">5</h2>
//               <p className="caretaker-para">Current Streak</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">3</h2>
//               <p className="caretaker-para">Missed This Month</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">4</h2>
//               <p className="caretaker-para">Taken This Week</p>
//             </div>
//           </div>
//         </div>

//         <div className="button-container">
//           <button className="active-cls-btn" onClick={onHandleChange}>Overview</button>
//           <button className="button-cls">Recent Activity</button>
//           <button className="button-cls">Calendar View</button>
//           <button className="button-cls">Notifications</button>
//         </div>

//         {/* Render components only if we have a valid patient */}
//         {patient && (
//           <>
//             <Overview userId={patient.id} />
//             <RecentMedicationActivity userId={patient.id} />
//             <MedicationCalendar userId={patient.id} />
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default CaretakerDashboard;




// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import Navbar from '../components/Navbar';
// import RecentMedicationActivity from '../components/RecentMedication.jsx';
// import MedicationCalendar from '../components/MedicationCalendar.jsx';
// import Overview from '../components/overviewDashboard.jsx';
// import '../style/caretaker.css';
// import axios from '../api/axiosInstance';

// const buttonList = [
//   {id:1,isActive:true,name:'Overview'},
//   {id:2,isActive:false,name:'Recent Activity'},
//   {id:2,isActive:false,name:'Calendar View'},
//   {id:2,isActive:false,name:'Notifications'}
// ]

// const CaretakerDashboard = () => {
//   const { user } = useAuth(); // ensures JWT is checked
//   const userId = user?.id;
//   const [patient, setPatient] = useState(null);

//   useEffect(() => {
//     const fetchAssignedPatient = async () => {
//       try {
//         const res = await axios.get(`/caretaker/:id/medications`);
//         setPatient(res.data[0] || null);
//         console.log(res.data)
//       } catch (err) {
//         console.error('Error fetching assigned patient:', err);
//       }
//     };
//     if (userId) fetchAssignedPatient();
//   }, [userId]);

//   const onHandleChange = () =>{
//     console.log("is Active")
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="caretaker-container">
//         {/* <div className="caretaker-header">
//           <h1>Caretaker Dashboard</h1>
//           {patient && <p>Monitoring {patient.name}'s medication adherence</p>}
//         </div> */}
//         <div className="caretaker-dashboard-container">
//           <div className='caretaker-dashboard-card'>
//             <img width="24" height="24" src="https://img.icons8.com/material-two-tone/24/businessman.png" className="icon" alt="businessman" />
//             <div>
//               <h1 className="caretaker-heading">Caretaker Dashboard</h1>
//               <p className="caretaker-para">Monitoring Eleanor Thompson's medication adherence</p>
//             </div>
//           </div>
//           <div className="percentage-container">
//             <div className="percentage-card">
//               <h2 className="caretaker-head">85%</h2>
//               <p className="caretaker-para">Adherence Percentage</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">5</h2>
//               <p className="caretaker-para">Current Streak</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">3</h2>
//               <p className="caretaker-para">Missed This Month</p>
//             </div>
//             <div className="percentage-card">
//               <h2 className="caretaker-head">4</h2>
//               <p className="caretaker-para">Taken This Week</p>
//             </div>
//           </div>
//         </div>
//         <div className="button-container">
//           <button className="active-cls-btn" onClick={onHandleChange}>Overview</button>
//           <button className="button-cls">Recent Activity</button>
//           <button className="button-cls">Calendar View</button>
//           <button className="button-cls">Notifications</button>
//         </div>
//         {patient && (
//           <>
//             <Overview userId={patient.id} />
//             {/* <RecentMedicationActivity userId={patient.id} />
//             <MedicationCalendar userId={patient.id} /> */}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default CaretakerDashboard;
