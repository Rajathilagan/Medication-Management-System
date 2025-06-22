import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import '../style/PatientDashboard.css';
import MedicationCalendar from '../components/MedicationCalendar';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [userId,setUserId] = useState()
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    if (user?.id) fetchMedications(user.id);
  }, [user]);

  const fetchMedications = async (userId) => {
    try {
      const res = await axios.get(`/medications?user_id=${userId}`);
      setMedications(res.data);
      setUserId(userId)
    } catch (err) {
      console.error('Error fetching medications:', err);
    }
  };

  const markAsTaken = async (medicationId) => {
    try {
      await axios.post(`/medications/${medicationId}/mark`);
      alert('Marked as taken for today!');
    //   fetchMedications(user.id);
    } catch (err) {
      console.error('Failed to mark as taken:', err);
      alert('Failed to mark. Try again.',medicationId);
    }
  };

//   const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      <div className="patient-dashboard">
        <h2 className="title">My Medications</h2>
        {/* <p className="subtitle">Today: {today}</p> */}

        {medications.length === 0 ? (
          <p>No medications assigned.</p>
        ) : (
          <div className="medication-list">
            {medications.map((med) => (
              <div className="medication-card" key={med.id}>
                <div>
                  <h3>{med.name}</h3>
                  <p>Dosage: {med.dosage}</p>
                  <p>Frequency: {med.frequency}</p>
                </div>
                <button
                  className="mark-btn"
                  onClick={() => markAsTaken(med.id)}
                >
                  Mark as Taken (Today)
                </button>
              </div>
            ))}
          </div>
        )}
        <MedicationCalendar userId = {userId} />
      </div>
    </>
  );
};

export default PatientDashboard;
