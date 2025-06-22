import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import '../style/medicationForm.css';

const AddMedicationForm = ({ userId }) => {
  const [medications, setMedications] = useState([]);
  const [addName, setAddName] = useState('');
  const [addDosage, setAddDosage] = useState('');
  const [addFrequency, setAddFrequency] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateDosage, setUpdateDosage] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const res = await axios.get('/medications', {
          params: { user_id: userId },
        });
        setMedications(res.data);
      } catch (err) {
        console.error('Failed to fetch medications:', err);
      }
    };

    if (userId) fetchMedications();
  }, [userId]);

  const handleSubmitAddForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/medications', {
        user_id: userId,
        name: addName,
        dosage: addDosage,
        frequency: addFrequency,
      });
      setAddName('');
      setAddDosage('');
      setAddFrequency('');
    } catch (err) {
      console.error('Failed to add medication:', err.message);
    }
  };

  const handleSelectChange = (e) => {
    const medId = e.target.value;
    const selected = medications.find((med) => med.id === Number(medId));
    setSelectedMedId(medId);
    setUpdateName(selected?.name || '');
    setUpdateDosage(selected?.dosage || '');
    setUpdateFrequency(selected?.frequency || '');
  };

  const handleSubmitUpdateForm = async (e) => {
    e.preventDefault();
    if (!selectedMedId) return alert('Please select a medication to update.');

    try {
      await axios.put(`/medications/${selectedMedId}`, {
        name: updateName,
        dosage: updateDosage,
        frequency: updateFrequency,
      });
      setSelectedMedId('');
      setUpdateName('');
      setUpdateDosage('');
      setUpdateFrequency('');
    } catch (err) {
      console.error('Failed to update medication:', err.message);
    }
  };

  return (
    <div className="medication-form-container">
      <form className="medication-form" onSubmit={handleSubmitAddForm}>
        <h3>Add Medication</h3>
        <input
          type="text"
          placeholder="Medication Name"
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={addDosage}
          onChange={(e) => setAddDosage(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Frequency"
          value={addFrequency}
          onChange={(e) => setAddFrequency(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <form className="medication-form" onSubmit={handleSubmitUpdateForm}>
        <h3>Update Medication</h3>
        <select value={selectedMedId} onChange={handleSelectChange} required>
          <option value="">Select Medication</option>
          {medications.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name} - {med.dosage}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Updated Name"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Updated Dosage"
          value={updateDosage}
          onChange={(e) => setUpdateDosage(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Updated Frequency"
          value={updateFrequency}
          onChange={(e) => setUpdateFrequency(e.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AddMedicationForm;