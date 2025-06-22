import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const Caretaker = ({ userId }) => {
  const [adherence, setAdherence] = useState({ taken: 0, missed: 0, remaining: 0 });
  console.log(adherence)

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

  const adherencePercentage = Math.round(((adherence.taken)/(adherence.taken + adherence.missed)) * 100)


  return (
    <div className="percentage-container">
      <div className="percentage-card">
        <h2 className="caretaker-head">{adherencePercentage}%</h2>
        <p className="caretaker-para">Adherence Percentage</p>
      </div>
      <div className="percentage-card">
        <h2 className="caretaker-head">{adherence.taken}</h2>
        <p className="caretaker-para">Taken this Month</p>
      </div>
      <div className="percentage-card">
        <h2 className="caretaker-head">{adherence.missed}</h2>
        <p className="caretaker-para">Missed This Month</p>
      </div>
      <div className="percentage-card">
        <h2 className="caretaker-head">{remaining}</h2>
        <p className="caretaker-para">Remaining this Month</p>
      </div>
    </div>
  );
};

export default Caretaker;
