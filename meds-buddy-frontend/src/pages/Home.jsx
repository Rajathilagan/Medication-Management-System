import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../style/home.css'

function Home() {
    const navigate = useNavigate()
    const onClickLogin = () =>{
        navigate("/login")
    }
    return (
        <div className='home-container'>
            <img width="48" height="48" src="https://img.icons8.com/doodle/48/m.png" alt="m" />
            <h1 className='home-heading'>Welcome to Meds Buddy Companion</h1>
            <p className='home-info'>Welcome to Meds Buddy – your partner in reliable, personalized medication management. Whether you're tracking your own health or caring for others, choose your role to access tools designed just for you.</p>
            <div className='patient-caretaker-container'>
                <div className='patient-caretaker-card'>
                    <img />
                    <h2 className='patient-heading'>I'm a Patient</h2>
                    <p className='info'>Take control of your health with simple, daily medication tracking and reminders made just for you."</p>
                    <ul className='list-msg custom-patient-bullets'>
                        <li>Mark medications as taken</li>
                        <li>Upload proof photos (optional)</li>
                        <li>View your medication calendar</li>
                        <li>Large, easy-to-use interface</li>
                    </ul>
                    <button onClick ={onClickLogin} className='patient-btn'>
                        Continue as Patient
                    </button>
                </div>
                <div className='patient-caretaker-card'>
                    <img />
                    <h2 className='caretaker-heading'>I'm a Caretaker</h2>
                    <p className='info'>Easily support your patients with clear schedules, progress tracking, and timely updates—all in one place.</p>
                    <ul className='list-msg custom-caretaker-bullets'>
                        <li>Monitor medication compliance</li>
                        <li>Update medical reports</li>
                        <li>Set up notification preferences</li>
                        <li>View detailed reports</li>
                    </ul>
                <button className='caretaker-btn' onClick={onClickLogin}>
                        Continue as Caretaker
                    </button>
                </div>
            </div>
            <p className='info'>Pick your role to access personalized features</p>
        </div>
    )
}

export default Home